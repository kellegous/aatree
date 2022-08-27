#include "node.h"

namespace kellegous {
namespace aatree {

template <class K, class V>
std::shared_ptr<Node<K, V>> Node<K, V>::insert(K key, V val) {
    return std::shared_ptr<Node<K, V>>();
}

template <class K, class V>
std::shared_ptr<Node<K, V>> Node<K, V>::nil(K key, V val) {
    std::shared_ptr<Node<K, V>> n(new Node<K, V>(key, val, 0));
    n->m_left = n;
    n->m_right = n;
    return n;
}

}  // namespace aatree
}  // namespace kellegous