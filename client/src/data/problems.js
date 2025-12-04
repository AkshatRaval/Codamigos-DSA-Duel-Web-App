export const dataset = [
  {
    "id": "reverse-string",
    "title": "Reverse String",
    "difficulty": "easy",
    "tags": ["string", "two-pointers"],
    "statement": "Write a function that reverses a string. The input string is given as an array of characters 's'. You must do this by modifying the input array in-place with O(1) extra memory.",
    "constraints": [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ASCII character."
    ],
    "samples": [
      {
        "input": "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]",
        "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]"
      },
      {
        "input": "s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]",
        "output": "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]"
      }
    ],
    "tests": [
      { "input": "[\"h\",\"e\",\"l\",\"l\",\"o\"]", "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]" },
      { "input": "[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", "output": "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]" },
      { "input": "[\"a\"]", "output": "[\"a\"]" },
      { "input": "[\"a\",\"b\"]", "output": "[\"b\",\"a\"]" },
      { "input": "[\"A\",\" \",\"m\"]", "output": "[\"m\",\" \",\"A\"]" }
    ],
    "starterCode": {
      "javascript": "function reverseString(s) {\n  // Write your code here\n}\n",
      "python": "def reverseString(s):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid reverseString(vector<char>& s) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "valid-parentheses",
    "title": "Valid Parentheses",
    "difficulty": "easy",
    "tags": ["string", "stack"],
    "statement": "Given a string 's' containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: \n1. Open brackets must be closed by the same type of brackets. \n2. Open brackets must be closed in the correct order. \n3. Every close bracket has a corresponding open bracket of the same type.",
    "constraints": [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    "samples": [
      {
        "input": "s = \"()\"",
        "output": "true"
      },
      {
        "input": "s = \"()[]{}\"",
        "output": "true"
      },
      {
        "input": "s = \"(]\"",
        "output": "false"
      },
      {
        "input": "s = \"{[]}\"",
        "output": "true"
      }
    ],
    "tests": [
      { "input": "\"()\"", "output": "true" },
      { "input": "\"()[]{}\"", "output": "true" },
      { "input": "\"(]\"", "output": "false" },
      { "input": "\"([)]\"", "output": "false" },
      { "input": "\"{[]}\"", "output": "true" },
      { "input": "\"[\"", "output": "false" },
      { "input": "\")\"", "output": "false" },
      { "input": "\"(([\"", "output": "false" }
    ],
    "starterCode": {
      "javascript": "function isValid(s) {\n  // Write your code here\n}\n",
      "python": "def isValid(s):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool isValid(string s) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "merge-two-sorted-lists",
    "title": "Merge Two Sorted Lists",
    "difficulty": "easy",
    "tags": ["linked-list", "recursion", "pointers"],
    "statement": "You are given the heads of two sorted linked lists 'list1' and 'list2'. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    "constraints": [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    "samples": [
      {
        "input": "list1 = [1,2,4], list2 = [1,3,4]",
        "output": "[1,1,2,3,4,4]"
      },
      {
        "input": "list1 = [], list2 = []",
        "output": "[]"
      },
      {
        "input": "list1 = [], list2 = [0]",
        "output": "[0]"
      }
    ],
    "tests": [
      { "input": "[1,2,4]\n[1,3,4]", "output": "[1,1,2,3,4,4]" },
      { "input": "[]\n[]", "output": "[]" },
      { "input": "[]\n[0]", "output": "[0]" },
      { "input": "[1]\n[2]", "output": "[1,2]" },
      { "input": "[2]\n[1]", "output": "[1,2]" },
      { "input": "[5]\n[1,2,4]", "output": "[1,2,4,5]" }
    ],
    "starterCode": {
      "javascript": "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n * this.val = (val===undefined ? 0 : val)\n * this.next = (next===undefined ? null : next)\n * }\n */\nfunction mergeTwoLists(list1, list2) {\n  // Write your code here\n}\n",
      "python": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef mergeTwoLists(list1, list2):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n/* Definition for singly-linked list. */\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode() : val(0), next(nullptr) {}\n    ListNode(int x) : val(x), next(nullptr) {}\n    ListNode(int x, ListNode *next) : val(x), next(next) {}\n};\n\nListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Write your code here\n}\n",
      "java": "/**\n * Definition for singly-linked list.\n * public class ListNode {\n * int val;\n * ListNode next;\n * ListNode() {}\n * ListNode(int val) { this.val = val; }\n * ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "best-time-to-buy-and-sell-stock",
    "title": "Best Time to Buy and Sell Stock",
    "difficulty": "easy",
    "tags": ["array", "dynamic-programming", "greedy"],
    "statement": "You are given an array 'prices' where prices[i] is the price of a given stock on the 'i-th' day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "samples": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "output": "5",
        "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5. Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell."
      },
      {
        "input": "prices = [7,6,4,3,1]",
        "output": "0",
        "explanation": "In this case, no transactions are done and the max profit = 0."
      }
    ],
    "tests": [
      { "input": "[7,1,5,3,6,4]", "output": "5" },
      { "input": "[7,6,4,3,1]", "output": "0" },
      { "input": "[1]", "output": "0" },
      { "input": "[1,2]", "output": "1" },
      { "input": "[2,1]", "output": "0" },
      { "input": "[2,4,1,3]", "output": "2" },
      { "input": "[3,3,5,0,0,3,1,4]", "output": "4" }
    ],
    "starterCode": {
      "javascript": "function maxProfit(prices) {\n  // Write your code here\n}\n",
      "python": "def maxProfit(prices):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint maxProfit(vector<int>& prices) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "binary-search",
    "title": "Binary Search",
    "difficulty": "easy",
    "tags": ["array", "binary-search"],
    "statement": "Given an array of integers 'nums' which is sorted in ascending order, and an integer 'target', write a function to search 'target' in 'nums'. If 'target' exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in 'nums' are unique.",
      "'nums' is sorted in ascending order."
    ],
    "samples": [
      {
        "input": "nums = [-1,0,3,5,9,12], target = 9",
        "output": "4",
        "explanation": "9 exists in nums and its index is 4"
      },
      {
        "input": "nums = [-1,0,3,5,9,12], target = 2",
        "output": "-1",
        "explanation": "2 does not exist in nums so return -1"
      }
    ],
    "tests": [
      { "input": "[-1,0,3,5,9,12]\n9", "output": "4" },
      { "input": "[-1,0,3,5,9,12]\n2", "output": "-1" },
      { "input": "[5]\n5", "output": "0" },
      { "input": "[5]\n-5", "output": "-1" },
      { "input": "[2,5]\n2", "output": "0" },
      { "input": "[2,5]\n5", "output": "1" }
    ],
    "starterCode": {
      "javascript": "function search(nums, target) {\n  // Write your code here\n}\n",
      "python": "def search(nums, target):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "climbing-stairs",
    "title": "Climbing Stairs",
    "difficulty": "easy",
    "tags": ["dynamic-programming", "math", "memoization"],
    "statement": "You are climbing a staircase. It takes 'n' steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "constraints": [
      "1 <= n <= 45"
    ],
    "samples": [
      {
        "input": "n = 2",
        "output": "2",
        "explanation": "There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps"
      },
      {
        "input": "n = 3",
        "output": "3",
        "explanation": "There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step"
      }
    ],
    "tests": [
      { "input": "2", "output": "2" },
      { "input": "3", "output": "3" },
      { "input": "1", "output": "1" },
      { "input": "4", "output": "5" },
      { "input": "5", "output": "8" },
      { "input": "45", "output": "1836311903" }
    ],
    "starterCode": {
      "javascript": "function climbStairs(n) {\n  // Write your code here\n}\n",
      "python": "def climbStairs(n):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint climbStairs(int n) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "longest-substring-without-repeating-characters",
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "medium",
    "tags": ["string", "sliding-window", "hash-map"],
    "statement": "Given a string 's', find the length of the longest substring without repeating characters. A substring is a contiguous non-empty sequence of characters within a string.",
    "constraints": [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    "samples": [
      {
        "input": "s = \"abcabcbb\"",
        "output": "3",
        "explanation": "The answer is \"abc\", with the length of 3."
      },
      {
        "input": "s = \"bbbbb\"",
        "output": "1",
        "explanation": "The answer is \"b\", with the length of 1."
      },
      {
        "input": "s = \"pwwkew\"",
        "output": "3",
        "explanation": "The answer is \"wke\", with the length of 3. Notice that the answer must be a substring, \"pwke\" is a subsequence and not a substring."
      }
    ],
    "tests": [
      { "input": "\"abcabcbb\"", "output": "3" },
      { "input": "\"bbbbb\"", "output": "1" },
      { "input": "\"pwwkew\"", "output": "3" },
      { "input": "\"\"", "output": "0" },
      { "input": "\" \"", "output": "1" },
      { "input": "\"au\"", "output": "2" },
      { "input": "\"dvdf\"", "output": "3" },
      { "input": "\"aab\"", "output": "2" }
    ],
    "starterCode": {
      "javascript": "function lengthOfLongestSubstring(s) {\n  // Write your code here\n}\n",
      "python": "def lengthOfLongestSubstring(s):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "product-of-array-except-self",
    "title": "Product of Array Except Self",
    "difficulty": "medium",
    "tags": ["array", "prefix-sum"],
    "statement": "Given an integer array 'nums', return an array 'answer' such that 'answer[i]' is equal to the product of all the elements of 'nums' except 'nums[i]'. The product of any prefix or suffix of 'nums' is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.",
    "constraints": [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix of 'nums' is guaranteed to fit in a 32-bit integer."
    ],
    "samples": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[24,12,8,6]"
      },
      {
        "input": "nums = [-1,1,0,-3,3]",
        "output": "[0,0,9,0,0]",
        "explanation": "Note that 'answer[2]' is 0 because nums[2] is 0, but the product of all other elements (-1 * 1 * -3 * 3) is 9."
      }
    ],
    "tests": [
      { "input": "[1,2,3,4]", "output": "[24,12,8,6]" },
      { "input": "[-1,1,0,-3,3]", "output": "[0,0,9,0,0]" },
      { "input": "[0,0]", "output": "[0,0]" },
      { "input": "[1,0]", "output": "[0,1]" },
      { "input": "[5,2]", "output": "[2,5]" },
      { "input": "[1,1,1,1]", "output": "[1,1,1,1]" }
    ],
    "starterCode": {
      "javascript": "function productExceptSelf(nums) {\n  // Write your code here\n}\n",
      "python": "def productExceptSelf(nums):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> productExceptSelf(vector<int>& nums) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "kth-smallest-element-in-a-bst",
    "title": "Kth Smallest Element in a BST",
    "difficulty": "medium",
    "tags": ["tree", "bst", "dfs", "inorder-traversal", "binary-search-tree"],
    "statement": "Given the 'root' of a binary search tree (BST) and an integer 'k', return the 'k-th' smallest element (1-indexed) in the BST. Note that a BST's inorder traversal yields its elements in sorted order.",
    "constraints": [
      "The number of nodes in the tree is 'n'.",
      "1 <= k <= n <= 10^5",
      "0 <= Node.val <= 10^5"
    ],
    "samples": [
      {
        "input": "root = [3,1,4,null,2], k = 1",
        "output": "1",
        "explanation": "The BST has nodes 1, 2, 3, 4. Inorder traversal is [1, 2, 3, 4]. The 1st smallest is 1."
      },
      {
        "input": "root = [5,3,6,2,4,null,null,1], k = 3",
        "output": "3",
        "explanation": "Inorder traversal is [1, 2, 3, 4, 5, 6]. The 3rd smallest is 3."
      }
    ],
    "tests": [
      { "input": "[3,1,4,null,2]\n1", "output": "1" },
      { "input": "[5,3,6,2,4,null,null,1]\n3", "output": "3" },
      { "input": "[1]\n1", "output": "1" },
      { "input": "[2,1]\n2", "output": "2" },
      { "input": "[5,3,7,2,4,6,8]\n7", "output": "8" }
    ],
    "starterCode": {
      "javascript": "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n * this.val = (val===undefined ? 0 : val)\n * this.left = (left===undefined ? null : left)\n * this.right = (right===undefined ? null : right)\n * }\n */\nfunction kthSmallest(root, k) {\n  // Write your code here\n}\n",
      "python": "# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\ndef kthSmallest(root, k):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n/* Definition for a binary tree node. */\nstruct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode() : val(0), left(nullptr), right(nullptr) {}\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n};\n\nint kthSmallest(TreeNode* root, int k) {\n    // Write your code here\n}\n",
      "java": "/**\n * Definition for a binary tree node.\n * public class TreeNode {\n * int val;\n * TreeNode left;\n * TreeNode right;\n * TreeNode() {}\n * TreeNode(int val) { this.val = val; }\n * TreeNode(int val, TreeNode left, TreeNode right) {\n * this.val = val;\n * this.left = left;\n * this.right = right;\n * }\n * }\n */\nclass Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "median-of-two-sorted-arrays",
    "title": "Median of Two Sorted Arrays",
    "difficulty": "hard",
    "tags": ["array", "binary-search", "divide-and-conquer"],
    "statement": "Given two sorted arrays 'nums1' and 'nums2' of size 'm' and 'n' respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    "constraints": [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m, n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    "samples": [
      {
        "input": "nums1 = [1,3], nums2 = [2]",
        "output": "2.00000",
        "explanation": "Merged array = [1,2,3] and median is 2."
      },
      {
        "input": "nums1 = [1,2], nums2 = [3,4]",
        "output": "2.50000",
        "explanation": "Merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
      }
    ],
    "tests": [
      { "input": "[1,3]\n[2]", "output": "2.00000" },
      { "input": "[1,2]\n[3,4]", "output": "2.50000" },
      { "input": "[0,0]\n[0,0]", "output": "0.00000" },
      { "input": "[]\n[1]", "output": "1.00000" },
      { "input": "[2]\n[]", "output": "2.00000" },
      { "input": "[]\n[2,3]", "output": "2.50000" },
      { "input": "[1,1,1]\n[1,1,1]", "output": "1.00000" }
    ],
    "starterCode": {
      "javascript": "function findMedianSortedArrays(nums1, nums2) {\n  // Write your code here\n}\n",
      "python": "def findMedianSortedArrays(nums1, nums2):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\ndouble findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "two-sum",
    "title": "Two Sum",
    "difficulty": "easy",
    "tags": ["array", "hash-table"],
    "statement": "Given an array of integers 'nums' and an integer 'target', return indices of the two numbers such that they add up to 'target'. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    "samples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        "input": "nums = [3,2,4], target = 6",
        "output": "[1,2]"
      }
    ],
    "tests": [
      { "input": "[2,7,11,15]\n9", "output": "[0,1]" },
      { "input": "[3,2,4]\n6", "output": "[1,2]" },
      { "input": "[3,3]\n6", "output": "[0,1]" }
    ],
    "starterCode": {
      "javascript": "function twoSum(nums, target) {\n  // Write your code here\n}\n",
      "python": "def twoSum(nums, target):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "maximum-subarray",
    "title": "Maximum Subarray",
    "difficulty": "medium",
    "tags": ["array", "divide-and-conquer", "dynamic-programming"],
    "statement": "Given an integer array 'nums', find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "samples": [
      {
        "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        "output": "6",
        "explanation": "The subarray [4,-1,2,1] has the largest sum = 6."
      },
      {
        "input": "nums = [1]",
        "output": "1"
      }
    ],
    "tests": [
      { "input": "[-2,1,-3,4,-1,2,1,-5,4]", "output": "6" },
      { "input": "[1]", "output": "1" },
      { "input": "[5,4,-1,7,8]", "output": "23" },
      { "input": "[-1]", "output": "-1" }
    ],
    "starterCode": {
      "javascript": "function maxSubArray(nums) {\n  // Write your code here\n}\n",
      "python": "def maxSubArray(nums):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "invert-binary-tree",
    "title": "Invert Binary Tree",
    "difficulty": "easy",
    "tags": ["tree", "dfs", "bfs", "binary-tree"],
    "statement": "Given the 'root' of a binary tree, invert the tree, and return its root.",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    "samples": [
      {
        "input": "root = [4,2,7,1,3,6,9]",
        "output": "[4,7,2,9,6,3,1]"
      },
      {
        "input": "root = [2,1,3]",
        "output": "[2,3,1]"
      }
    ],
    "tests": [
      { "input": "[4,2,7,1,3,6,9]", "output": "[4,7,2,9,6,3,1]" },
      { "input": "[2,1,3]", "output": "[2,3,1]" },
      { "input": "[]", "output": "[]" }
    ],
    "starterCode": {
      "javascript": "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n * this.val = (val===undefined ? 0 : val)\n * this.left = (left===undefined ? null : left)\n * this.right = (right===undefined ? null : right)\n * }\n */\nfunction invertTree(root) {\n  // Write your code here\n}\n",
      "python": "# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\ndef invertTree(root):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode() : val(0), left(nullptr), right(nullptr) {}\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n};\n\nTreeNode* invertTree(TreeNode* root) {\n    // Write your code here\n}\n",
      "java": "/**\n * Definition for a binary tree node.\n * public class TreeNode {\n * int val;\n * TreeNode left;\n * TreeNode right;\n * TreeNode() {}\n * TreeNode(int val) { this.val = val; }\n * TreeNode(int val, TreeNode left, TreeNode right) {\n * this.val = val;\n * this.left = left;\n * this.right = right;\n * }\n * }\n */\nclass Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "valid-anagram",
    "title": "Valid Anagram",
    "difficulty": "easy",
    "tags": ["string", "hash-table", "sorting"],
    "statement": "Given two strings 's' and 't', return true if 't' is an anagram of 's', and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    "constraints": [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    "samples": [
      {
        "input": "s = \"anagram\", t = \"nagaram\"",
        "output": "true"
      },
      {
        "input": "s = \"rat\", t = \"car\"",
        "output": "false"
      }
    ],
    "tests": [
      { "input": "\"anagram\"\n\"nagaram\"", "output": "true" },
      { "input": "\"rat\"\n\"car\"", "output": "false" },
      { "input": "\"a\"\n\"ab\"", "output": "false" },
      { "input": "\"listen\"\n\"silent\"", "output": "true" }
    ],
    "starterCode": {
      "javascript": "function isAnagram(s, t) {\n  // Write your code here\n}\n",
      "python": "def isAnagram(s, t):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool isAnagram(string s, string t) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "group-anagrams",
    "title": "Group Anagrams",
    "difficulty": "medium",
    "tags": ["string", "hash-table", "sorting"],
    "statement": "Given an array of strings 'strs', group the anagrams together. You can return the answer in any order.",
    "constraints": [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters."
    ],
    "samples": [
      {
        "input": "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
        "output": "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]"
      },
      {
        "input": "strs = [\"\"]",
        "output": "[[\"\"]]"
      }
    ],
    "tests": [
      { "input": "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", "output": "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" },
      { "input": "[\"a\"]", "output": "[[\"a\"]]" },
      { "input": "[\"\"]", "output": "[[\"\"]]" }
    ],
    "starterCode": {
      "javascript": "function groupAnagrams(strs) {\n  // Write your code here\n}\n",
      "python": "def groupAnagrams(strs):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvector<vector<string>> groupAnagrams(vector<string>& strs) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "number-of-islands",
    "title": "Number of Islands",
    "difficulty": "medium",
    "tags": ["array", "dfs", "bfs", "union-find", "matrix"],
    "statement": "Given an 'm x n' 2D binary grid 'grid' which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    "samples": [
      {
        "input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "output": "1"
      },
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3"
      }
    ],
    "tests": [
      { "input": "[[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", "output": "1" },
      { "input": "[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", "output": "3" },
      { "input": "[[\"0\"]]", "output": "0" }
    ],
    "starterCode": {
      "javascript": "function numIslands(grid) {\n  // Write your code here\n}\n",
      "python": "def numIslands(grid):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint numIslands(vector<vector<char>>& grid) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "container-with-most-water",
    "title": "Container With Most Water",
    "difficulty": "medium",
    "tags": ["array", "two-pointers", "greedy"],
    "statement": "You are given an integer array 'height' of length 'n'. There are 'n' vertical lines drawn such that the two endpoints of the 'i-th' line are '(i, 0)' and '(i, height[i])'. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    "constraints": [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    "samples": [
      {
        "input": "height = [1,8,6,2,5,4,8,3,7]",
        "output": "49",
        "explanation": "The max area is 49 (height 7 * width 7)."
      },
      {
        "input": "height = [1,1]",
        "output": "1"
      }
    ],
    "tests": [
      { "input": "[1,8,6,2,5,4,8,3,7]", "output": "49" },
      { "input": "[1,1]", "output": "1" },
      { "input": "[4,3,2,1,4]", "output": "16" },
      { "input": "[1,2,1]", "output": "2" }
    ],
    "starterCode": {
      "javascript": "function maxArea(height) {\n  // Write your code here\n}\n",
      "python": "def maxArea(height):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint maxArea(vector<int>& height) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public int maxArea(int[] height) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "search-in-rotated-sorted-array",
    "title": "Search in Rotated Sorted Array",
    "difficulty": "medium",
    "tags": ["array", "binary-search"],
    "statement": "There is an integer array 'nums' sorted in ascending order (with distinct values). Prior to being passed to your function, 'nums' is possibly rotated at an unknown pivot index 'k' (1 <= k < nums.length). Given the array 'nums' after the possible rotation and an integer 'target', return the index of 'target' if it is in 'nums', or '-1' if it is not in 'nums'. You must write an algorithm with O(log n) runtime complexity.",
    "constraints": [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique.",
      "nums is an ascending array that is possibly rotated.",
      "-10^4 <= target <= 10^4"
    ],
    "samples": [
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 0",
        "output": "4"
      },
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 3",
        "output": "-1"
      }
    ],
    "tests": [
      { "input": "[4,5,6,7,0,1,2]\n0", "output": "4" },
      { "input": "[4,5,6,7,0,1,2]\n3", "output": "-1" },
      { "input": "[1]\n0", "output": "-1" }
    ],
    "starterCode": {
      "javascript": "function search(nums, target) {\n  // Write your code here\n}\n",
      "python": "def search(nums, target):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "longest-palindromic-substring",
    "title": "Longest Palindromic Substring",
    "difficulty": "medium",
    "tags": ["string", "dynamic-programming"],
    "statement": "Given a string 's', return the longest palindromic substring in 's'.",
    "constraints": [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters."
    ],
    "samples": [
      {
        "input": "s = \"babad\"",
        "output": "\"bab\"",
        "explanation": "\"aba\" is also a valid answer."
      },
      {
        "input": "s = \"cbbd\"",
        "output": "\"bb\""
      }
    ],
    "tests": [
      { "input": "\"babad\"", "output": "\"bab\"" },
      { "input": "\"cbbd\"", "output": "\"bb\"" },
      { "input": "\"a\"", "output": "\"a\"" },
      { "input": "\"ac\"", "output": "\"a\"" }
    ],
    "starterCode": {
      "javascript": "function longestPalindrome(s) {\n  // Write your code here\n}\n",
      "python": "def longestPalindrome(s):\n    # Write your code here\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nstring longestPalindrome(string s) {\n    // Write your code here\n}\n",
      "java": "class Solution {\n    public String longestPalindrome(String s) {\n        // Write your code here\n    }\n}\n"
    }
  },
  {
    "id": "serialize-and-deserialize-binary-tree",
    "title": "Serialize and Deserialize Binary Tree",
    "difficulty": "hard",
    "tags": ["tree", "design", "string", "bfs", "dfs"],
    "statement": "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment. Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-1000 <= Node.val <= 1000"
    ],
    "samples": [
      {
        "input": "root = [1,2,3,null,null,4,5]",
        "output": "[1,2,3,null,null,4,5]"
      },
      {
        "input": "root = []",
        "output": "[]"
      }
    ],
    "tests": [
      { "input": "[1,2,3,null,null,4,5]", "output": "[1,2,3,null,null,4,5]" },
      { "input": "[]", "output": "[]" }
    ],
    "starterCode": {
      "javascript": "/**\n * Definition for a binary tree node.\n * function TreeNode(val) {\n * this.val = val;\n * this.left = this.right = null;\n * }\n */\n\n/**\n * Encodes a tree to a single string.\n * \n * @param {TreeNode} root\n * @return {string}\n */\nvar serialize = function(root) {\n    // Write your code here\n};\n\n/**\n * Decodes your encoded data to tree.\n * \n * @param {string} data\n * @return {TreeNode}\n */\nvar deserialize = function(data) {\n    // Write your code here\n};\n",
      "python": "# Definition for a binary tree node.\n# class TreeNode(object):\n#     def __init__(self, x):\n#         self.val = x\n#         self.left = None\n#         self.right = None\n\nclass Codec:\n\n    def serialize(self, root):\n        \"\"\"Encodes a tree to a single string.\n        \n        :type root: TreeNode\n        :rtype: str\n        \"\"\"\n        # Write your code here\n        pass\n        \n\n    def deserialize(self, data):\n        \"\"\"Decodes your encoded data to tree.\n        \n        :type data: str\n        :rtype: TreeNode\n        \"\"\"\n        # Write your code here\n        pass\n        \n\n# Your Codec object will be instantiated and called as such:\n# ser = Codec()\n# deser = Codec()\n# ans = deser.deserialize(ser.serialize(root))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode(int x) : val(x), left(NULL), right(NULL) {}\n};\n\nclass Codec {\npublic:\n\n    // Encodes a tree to a single string.\n    string serialize(TreeNode* root) {\n        // Write your code here\n    }\n\n    // Decodes your encoded data to tree.\n    TreeNode* deserialize(string data) {\n        // Write your code here\n    }\n};\n",
      "java": "/**\n * Definition for a binary tree node.\n * public class TreeNode {\n * int val;\n * TreeNode left;\n * TreeNode right;\n * TreeNode(int x) { val = x; }\n * }\n */\npublic class Codec {\n\n    // Encodes a tree to a single string.\n    public String serialize(TreeNode root) {\n        // Write your code here\n    }\n\n    // Decodes your encoded data to tree.\n    public TreeNode deserialize(String data) {\n        // Write your code here\n    }\n}\n"
    }
  }
];
