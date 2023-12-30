# Backend

Source code for lettfaktura API

## Settings and Secret variables 🔐

* General settings is on `settings.toml` file.
* Secret variables can be defines on `secret.toml` file, which can be on same directory or one folder back to main directory.

* `default` is applied to all environment, and can be overridden by specific environment. Specific settings can be applied to `local`, `testing`, and `production` environment.

    ```
    [default]

    JWT_SECRET_KEY = "SECURED_SECRET_KEY"
    TELEGRAM_TOKEN = "TELEGRAM_BOT_TOKEN"
    DB_PASSWORD = "DATABASE_PASSWORD"
    SMTP__norway__customer__password = "CUSTOMER_EMAIL_PASSWORD"
    SMTP__norway__admin__password = "WEBMAILER_EMAIL_PASSWORD"
    SMTP__sweden__customer__password = "CUSTOMER_EMAIL_PASSWORD"
    SMTP__sweden__admin__password = "CUSTOMER_EMAIL_PASSWORD"

    [local]

    # Settings for local environment

    [testing]

    # Settings for testing environment

    [production]

    # Settings for production environment
    ```
## Start the Development Server 🚀

* Create a pyenv environment with python version 3.11.2.
* Install the requirements on the environment

    ```bash
    pip install -r requirements.txt
    ```
* Set the environment to "local" (default)

    ```bash
    export FASTAPI_ENV = "local"
    ```

* Set the secrets.toml and secrets.toml files.

* Start the development server

    ```bash
    bash start.sh
    ```

## Development 👨‍💻

* Check the development [guidelines](https://gitlab.com/lettfaktura/documentation/-/wikis/workflows#-development-guidelines).
* Make sure to install pre-commit before making any commits to the repository. This ensures that the committed code follows the defined guidelines and passes any pre-commit checks.

    ```bash
    pip install pre-commit
    pre-commit install
    ```

## Documentation 📖

For comprehensive information on the system's architecture, documentation, and complex topics, please refer to the [documentation](https://gitlab.com/lettfaktura/documentation/-/wikis/backend).
