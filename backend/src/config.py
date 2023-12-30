"""FastAPI configuration module"""

from enum import Enum

from dynaconf import Dynaconf

settings = Dynaconf(
    settings_files=["settings.toml", ".secrets.toml", "../.secrets.toml"],
    environments=True,
    envvar_prefix=False,
    env_switcher="FASTAPI_ENV",
    dotenv_path=".env",
    default_env="default",
    env="local",
)


class Version(Enum):
    NORWAY = "norway"
    SWEDEN = "sweden"
