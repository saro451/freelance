"""Global variables for the application"""

from dataclasses import dataclass

from fastapi import Request

from src.config import Version


@dataclass
class AppGlobals:
    version: str = Version.NORWAY.value
    host: str = None  # Host
    language: str = "english"  # Language
    request: Request = None

    def initialize(self, data):
        for key in self.__dataclass_fields__.keys():
            self.__setattr__(key, data.get(key))


g = AppGlobals()
