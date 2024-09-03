#!/usr/bin/env python3
"""contains BasicCache class
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """a caching system
    """
    # MAX_ITEMS = None

    def put(self, key, item):
        """assigns to the dictionary self.cache_data
           the item value for the key key.
           If key or item is None, it does anything.
        """
        if key is None or item is None:
            return

        self.cache_data[key] = item

    def get(self, key):
        """returns the value in self.cache_data linked to key
           or None if the key is None or does not exist
        """
        return self.cache_data.get(key)
