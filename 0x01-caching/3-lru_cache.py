#!/usr/bin/env python3
"""contains LRUCache class
"""
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """a caching system
    """
    def __init__(self):
        """constructor
        """
        super().__init__()
        self.usage = []

    def put(self, key, item):
        """assigns to the dictionary self.cache_data
           the item value for the key key.
           If key or item is None, it does anything.
           If cache hits max size, the least recently used pair is removed
        """
        if key is None or item is None:
            return

        if key not in self.usage:
            self.usage.insert(0, key)

        self.cache_data[key] = item

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            lru = self.usage.pop(len(self.usage) - 1)
            del self.cache_data[lru]
            print(f'DISCARD: {lru}')

    def get(self, key):
        """returns the value in self.cache_data linked to key
           or None if the key is None or does not exist
        """
        data = self.cache_data.get(key)
        if data:
            index = self.usage.index(key)
            if index != 0:
                self.usage.pop(index)
                self.usage.insert(0, key)
        return data
