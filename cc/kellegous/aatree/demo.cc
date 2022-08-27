#include <iostream>
#include <string>

#include "kellegous/aatree/node.h"

using kellegous::aatree::Node;

int main(int argc, char* argv[]) {
    auto root = Node<int, int>::nil(0, 0);
    for (auto i = 0; i < 10; i++) {
        root = Node<int, int>::insert(root, i, i);
    }

    std::cout << "key = " << root->key()
              << ", val = " << root->val() << std::endl;

    return 0;
}