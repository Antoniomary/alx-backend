#!/usr/bin/env python3
"""contains the function index_range"""
import csv
import math
from typing import List, Tuple


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        """constructor
        """
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """returns the appropriate page of a dataset
        """
        assert (type(page) is int and type(page_size) is int)
        assert (page > 0 and page_size > 0)
        my_dataset = self.dataset()
        start_index, end_index = index_range(page, page_size)
        if len(my_dataset) < end_index:
            return []
        return list(my_dataset[start_index: end_index])


def index_range(page: int, page_size: int) -> Tuple:
    """returns a tuple of size two containing a start index and an end index
       corresponding to the range of indexes to return in a list
       for those particular pagination parameters.
    """
    return ((page - 1) * page_size, page * page_size)
