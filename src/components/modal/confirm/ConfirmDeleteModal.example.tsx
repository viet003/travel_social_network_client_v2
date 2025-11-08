/**
 * ConfirmDeleteModal - Reusable Delete Confirmation Modal
 * 
 * Examples of how to use this component for different scenarios
 */

import React, { useState } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

// ============================================
// Example 1: Delete Group
// ============================================
const DeleteGroupExample = () => {
  const [showModal, setShowModal] = useState(false);
  
  const handleDeleteGroup = async () => {
    // Call your API here
    // await apiDeleteGroup(groupId);
    console.log('Group deleted');
  };

  return (
    <ConfirmDeleteModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={handleDeleteGroup}
      type="group"
      itemName="Du lịch Việt Nam"
      showStats={true}
      stats={[
        { icon: 'fluent:people-24-regular', label: 'thành viên', value: 120 },
        { icon: 'fluent:document-24-regular', label: 'bài viết', value: 450 },
      ]}
    />
  );
};

// ============================================
// Example 2: Delete Conversation
// ============================================
const DeleteConversationExample = () => {
  const [showModal, setShowModal] = useState(false);
  
  const handleDeleteConversation = async () => {
    // await apiDeleteConversation(conversationId);
    console.log('Conversation deleted');
  };

  return (
    <ConfirmDeleteModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={handleDeleteConversation}
      type="conversation"
      itemName="Nguyễn Văn A"
      showStats={true}
      stats={[
        { icon: 'fluent:chat-24-regular', label: 'tin nhắn', value: 2543 },
        { icon: 'fluent:image-24-regular', label: 'ảnh', value: 89 },
      ]}
    />
  );
};

// ============================================
// Example 3: Delete User Account
// ============================================
const DeleteAccountExample = () => {
  const [showModal, setShowModal] = useState(false);
  
  const handleDeleteAccount = async () => {
    // await apiDeleteAccount();
    console.log('Account deleted');
  };

  return (
    <ConfirmDeleteModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={handleDeleteAccount}
      type="account"
      itemName="user@example.com"
      confirmText="DELETE MY ACCOUNT" // Custom confirmation text
      customWarning="Cảnh báo nghiêm trọng: Tài khoản của bạn sẽ bị xóa vĩnh viễn cùng với tất cả dữ liệu, bài viết, tin nhắn và kết nối. Hành động này KHÔNG THỂ HOÀN TÁC."
      showStats={true}
      stats={[
        { icon: 'fluent:document-24-regular', label: 'bài viết', value: 342 },
        { icon: 'fluent:people-24-regular', label: 'bạn bè', value: 156 },
        { icon: 'fluent:image-24-regular', label: 'ảnh', value: 1247 },
      ]}
    />
  );
};

// ============================================
// Example 4: Delete Post
// ============================================
const DeletePostExample = () => {
  const [showModal, setShowModal] = useState(false);
  
  const handleDeletePost = async () => {
    // await apiDeletePost(postId);
    console.log('Post deleted');
  };

  return (
    <ConfirmDeleteModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={handleDeletePost}
      type="post"
      itemName="Bài viết của tôi"
      confirmText="XÓA BÀI VIẾT" // Simple confirmation
      showStats={true}
      stats={[
        { icon: 'fluent:thumb-like-24-regular', label: 'lượt thích', value: 234 },
        { icon: 'fluent:comment-24-regular', label: 'bình luận', value: 56 },
        { icon: 'fluent:share-24-regular', label: 'chia sẻ', value: 12 },
      ]}
    />
  );
};

// ============================================
// Example 5: Delete Comment
// ============================================
const DeleteCommentExample = () => {
  const [showModal, setShowModal] = useState(false);
  
  const handleDeleteComment = async () => {
    // await apiDeleteComment(commentId);
    console.log('Comment deleted');
  };

  return (
    <ConfirmDeleteModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={handleDeleteComment}
      type="comment"
      itemName="Bình luận của bạn"
      confirmText="XÓA" // Very simple
    />
  );
};

// ============================================
// Example 6: Custom Delete (Flexible)
// ============================================
const DeleteCustomExample = () => {
  const [showModal, setShowModal] = useState(false);
  
  const handleDelete = async () => {
    // Your custom delete logic
    console.log('Custom item deleted');
  };

  return (
    <ConfirmDeleteModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={handleDelete}
      type="custom"
      itemName="Tên mục tùy chỉnh"
      customTitle="Xóa mục đặc biệt"
      customWarning="Cảnh báo tùy chỉnh cho hành động xóa này."
      confirmText="TÊN MỤC TÙY CHỈNH"
      showStats={true}
      stats={[
        { icon: 'fluent:star-24-regular', label: 'items', value: 100 },
      ]}
    />
  );
};

// Export all examples
export {
  DeleteGroupExample,
  DeleteConversationExample,
  DeleteAccountExample,
  DeletePostExample,
  DeleteCommentExample,
  DeleteCustomExample,
};
