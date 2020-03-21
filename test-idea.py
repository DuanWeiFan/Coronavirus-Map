
# [3,2,1]
def findKthLargest(nums, k):
    assert len(nums) >= k
    return findKthSmallest(nums, len(nums)-k+1)

def findKthSmallest(nums, k):
    l, r = 0, len(nums)-1
    pos = partition(nums, l, r)
    if k > pos+1:
        return findKthSmallest(nums[pos+1:], k-pos-1)
    elif k < pos+1:
        return findKthSmallest(nums[:pos], k)
    else:
        return nums[pos]

def partition(nums, l, r):
    idx = l
    while l < r:
        if nums[l] <= nums[r]:
            nums[idx], nums[l] = nums[l], nums[idx]
            idx += 1
        l += 1
    nums[idx], nums[r] = nums[r], nums[idx]
    return idx

li = [3,5,4,2,7,8]
k = 2
print(findKthLargest(li, k))