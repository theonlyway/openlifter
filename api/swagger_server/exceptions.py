# exceptions.py
class NotFoundException(RuntimeError):
    """Not found."""


class DocumentNotFound(NotFoundException):
    def __init__(self, filter, collection):
        super().__init__(
            f"Failed to find document with filter: {filter} in collection: {collection}")
