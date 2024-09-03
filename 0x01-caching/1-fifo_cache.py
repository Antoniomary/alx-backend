#!/usr/bin/env python3
"""contains FIFOCache class
"""
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """a caching system
    """
    def __init__(self):
        """constructor
        """
        super().__init__()
        self.keys = []

    def put(self, key, item):
        """assigns to the dictionary self.cache_data
           the item value for the key key.
           If key or item is None, it does anything.
           If cache hits max size, the first pair is removed
        """
        if key is None or item is None:
            return

        if key not in self.cache_data:
            self.keys.append(key)

        self.cache_data[key] = item

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            first_in = self.keys.pop(0)
            del self.cache_data[first_in]
            print(f'DISCARD: {first_in}')

    def get(self, key):
        """returns the value in self.cache_data linked to key
           or None if the key is None or does not exist
        """
        return self.cache_data.get(key)
