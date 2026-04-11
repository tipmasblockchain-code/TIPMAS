// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title TipmasMOLStaking
/// @notice Stake native MOL on TIPMAS and accrue time-based rewards.
contract TipmasMOLStaking {
    uint256 private constant YEAR_IN_SECONDS = 365 days;
    uint256 private constant MAX_APR_BPS = 10_000; // 100%

    struct Position {
        uint256 amount;
        uint256 unclaimedRewards;
        uint64 startedAt;
        uint64 unlockAt;
        uint64 lastRewardAt;
    }

    mapping(address => Position) private _positions;

    address public owner;
    uint16 public aprBps;
    uint64 public lockDuration;
    uint256 public totalStaked;

    bool private _locked;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event RewardsFunded(address indexed from, uint256 amount);
    event Staked(address indexed account, uint256 amount, uint256 totalUserStake, uint256 unlockAt);
    event Unstaked(address indexed account, uint256 amount, uint256 remainingStake);
    event RewardsClaimed(address indexed account, uint256 rewardAmount);
    event AprUpdated(uint16 previousAprBps, uint16 newAprBps);
    event LockDurationUpdated(uint64 previousLockDuration, uint64 newLockDuration);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier nonReentrant() {
        require(!_locked, "Reentrancy blocked");
        _locked = true;
        _;
        _locked = false;
    }

    constructor(uint16 initialAprBps, uint64 initialLockDuration) {
        require(initialAprBps <= MAX_APR_BPS, "APR too high");
        owner = msg.sender;
        aprBps = initialAprBps;
        lockDuration = initialLockDuration;
        emit OwnershipTransferred(address(0), msg.sender);
        emit AprUpdated(0, initialAprBps);
        emit LockDurationUpdated(0, initialLockDuration);
    }

    function stake() external payable nonReentrant {
        require(msg.value > 0, "Stake amount is zero");

        Position storage position = _positions[msg.sender];
        _accrueRewards(position);

        if (position.startedAt == 0) {
            position.startedAt = uint64(block.timestamp);
        }

        position.amount += msg.value;
        position.unlockAt = uint64(block.timestamp + lockDuration);
        position.lastRewardAt = uint64(block.timestamp);

        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value, position.amount, position.unlockAt);
    }

    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Unstake amount is zero");

        Position storage position = _positions[msg.sender];
        require(position.amount >= amount, "Insufficient stake");
        require(block.timestamp >= position.unlockAt, "Stake is locked");

        _accrueRewards(position);

        position.amount -= amount;
        totalStaked -= amount;

        if (position.amount == 0) {
            position.startedAt = 0;
            position.unlockAt = 0;
            position.lastRewardAt = 0;
        } else {
            position.lastRewardAt = uint64(block.timestamp);
        }

        _safeTransferNative(msg.sender, amount);
        emit Unstaked(msg.sender, amount, position.amount);
    }

    function claimRewards() external nonReentrant {
        Position storage position = _positions[msg.sender];
        _accrueRewards(position);

        uint256 rewardAmount = position.unclaimedRewards;
        require(rewardAmount > 0, "No rewards");

        uint256 availableRewards = _availableRewardsPool();
        require(availableRewards >= rewardAmount, "Insufficient reward pool");

        position.unclaimedRewards = 0;
        _safeTransferNative(msg.sender, rewardAmount);

        emit RewardsClaimed(msg.sender, rewardAmount);
    }

    function fundRewards() external payable {
        require(msg.value > 0, "Funding amount is zero");
        emit RewardsFunded(msg.sender, msg.value);
    }

    function setAprBps(uint16 newAprBps) external onlyOwner {
        require(newAprBps <= MAX_APR_BPS, "APR too high");
        uint16 previous = aprBps;
        aprBps = newAprBps;
        emit AprUpdated(previous, newAprBps);
    }

    function setLockDuration(uint64 newLockDuration) external onlyOwner {
        uint64 previous = lockDuration;
        lockDuration = newLockDuration;
        emit LockDurationUpdated(previous, newLockDuration);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero owner");
        address previous = owner;
        owner = newOwner;
        emit OwnershipTransferred(previous, newOwner);
    }

    function positionOf(address account)
        external
        view
        returns (uint256 amount, uint256 unclaimedRewards, uint64 startedAt, uint64 unlockAt, uint64 lastRewardAt)
    {
        Position memory position = _positions[account];
        uint256 pending = _pendingReward(position);
        return (
            position.amount,
            position.unclaimedRewards + pending,
            position.startedAt,
            position.unlockAt,
            position.lastRewardAt
        );
    }

    function pendingRewards(address account) external view returns (uint256) {
        Position memory position = _positions[account];
        return position.unclaimedRewards + _pendingReward(position);
    }

    function availableRewardsPool() external view returns (uint256) {
        return _availableRewardsPool();
    }

    function _accrueRewards(Position storage position) private {
        uint256 pending = _pendingReward(position);
        if (pending > 0) {
            position.unclaimedRewards += pending;
        }

        if (position.amount > 0) {
            position.lastRewardAt = uint64(block.timestamp);
        }
    }

    function _pendingReward(Position memory position) private view returns (uint256) {
        if (position.amount == 0 || position.lastRewardAt == 0 || aprBps == 0) {
            return 0;
        }

        uint256 elapsed = block.timestamp - uint256(position.lastRewardAt);
        if (elapsed == 0) {
            return 0;
        }

        return (position.amount * aprBps * elapsed) / (MAX_APR_BPS * YEAR_IN_SECONDS);
    }

    function _availableRewardsPool() private view returns (uint256) {
        return address(this).balance - totalStaked;
    }

    function _safeTransferNative(address to, uint256 value) private {
        (bool sent, ) = to.call{value: value}("");
        require(sent, "Native transfer failed");
    }
}
