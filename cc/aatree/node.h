#ifndef _KELLEGOUS_AATREE_NODE_H_
#define _KELLEGOUS_AATREE_NODE_H_

#include <iostream>
#include <memory>

namespace kellegous {

namespace aatree {

template <class K, class V>
class Node {
   public:
    Node(K key, V val, int level)
        : m_key(key), m_val(val), m_level(level) {}

    Node(K key, V val, int level,
         std::shared_ptr<Node<K, V>> left,
         std::shared_ptr<Node<K, V>> right)
        : m_key(key), m_val(val), m_level(level), m_left(left), m_right(right) {}

    Node() : m_level(0) {}

    ~Node() {
        std::cout << __PRETTY_FUNCTION__
                  << " ("
                  << "level: " << m_level << ", "
                  << "key: " << m_key << ", "
                  << "val: " << m_val
                  << ")"
                  << std::endl;
    }

    std::shared_ptr<Node<K, V>> right() { return m_right; }

    std::shared_ptr<Node<K, V>> left() { return m_left; }

    int level() { return m_level; }

    K key() { return m_key; }

    V val() { return m_val; }

    bool is_nil() {
        return this->m_level == 0;
    }

    static std::shared_ptr<Node<K, V>> insert(
        std::shared_ptr<Node<K, V>> root,
        K key,
        V val) {
        if (root->is_nil()) {
            return std::shared_ptr<Node<K, V>>(
                new Node(key, val, 1, root, root));
        } else if (key < root->m_key) {
            root->m_left = insert(leftOf(root), key, val);
        } else {
            root->m_right = insert(rightOf(root), key, val);
        }
        return split(skew(root));
    }

    static std::shared_ptr<Node<K, V>> nil(K key, V val) {
        std::shared_ptr<Node<K, V>> n(new Node<K, V>());
        return n;
    }

   private:
    static std::shared_ptr<Node<K, V>> rightOf(
        std::shared_ptr<Node<K, V>> root) {
        return root->is_nil() ? root : root->m_right;
    }

    static std::shared_ptr<Node<K, V>> leftOf(
        std::shared_ptr<Node<K, V>> root) {
        return root->is_nil() ? root : root->m_left;
    }

    static std::shared_ptr<Node<K, V>> skew(
        std::shared_ptr<Node<K, V>> root) {
        if (leftOf(root)->level() == root->level()) {
            auto q = root->m_left;
            root->m_left = q->m_right;
            q->m_right = root;
            return q;
        }
        return root;
    }

    static std::shared_ptr<Node<K, V>> split(
        std::shared_ptr<Node<K, V>> root) {
        if (rightOf(rightOf(root))->level() == root->level()) {
            auto q = root->m_right;
            root->m_right = q->m_left;
            q->m_left = root;
            q->m_level++;
            return q;
        }
        return root;
    }

    K m_key;
    V m_val;
    int m_level;
    std::shared_ptr<Node<K, V>> m_left;
    std::shared_ptr<Node<K, V>> m_right;
};

}  // namespace aatree

}  // namespace kellegous

#endif