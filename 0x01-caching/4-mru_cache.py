#!/usr/bin/env python3
"""contains MRUCache class
"""
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """a caching system
    """
    def __init__(self):
        """constructor
        """
        super().__init__()
        self.mru = None

    def put(self, key, item):
        """assigns to the dictionary self.cache_data
           the item value for the key key.
           If key or item is None, it does anything.
           If cache hits max size, the most recently used pair is removed
        """
        if key is None or item is None:
            return

        self.cache_data[key] = item

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            del self.cache_data[self.mru]
            print(f'DISCARD: {self.mru}')

        self.mru = key

    def get(self, key):
        """returns the value in self.cache_data linked to key
           or None if the key is None or does not exist
        """
        data = self.cache_data.get(key)
        if data:
            self.mru = key
        return data
