#!/usr/bin/env python3
"""contains LIFOCache class
"""
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """a caching system
    """
    def __init__(self):
        """constructor
        """
        super().__init__()
        self.last_in = None

    def put(self, key, item):
        """assigns to the dictionary self.cache_data
           the item value for the key key.
           If key or item is None, it does anything.
           If cache hits max size, the last pair is removed
        """
        if key is None or item is None:
            return

        self.cache_data[key] = item

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            del self.cache_data[self.last_in]
            print(f'DISCARD: {self.last_in}')

        self.last_in = key

    def get(self, key):
        """returns the value in self.cache_data linked to key
           or None if the key is None or does not exist
        """
        return self.cache_data.get(key)