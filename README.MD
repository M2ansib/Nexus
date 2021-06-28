# NEXUS **N**etwork-oriented **E**nhanced **A**ggregation **P**ortal

## Running the project

1. Clone the GitHub repository.

1. cd into the repo directory

    ```bash
    cd Nexus
    ```

### Setup chat interface

1. Clone the chat repo from https://github.com/riamundhra02/nexus_chat and follow the instructions to set it up

### Server

1. Install requirements

    ```bash
    cd server
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```
1. Create a .env file in /server and add in the required credentials

    ```
    MONGO_USERNAME=
    MONGO_PASSWORD=  
    TESTBENCH_USERNAME=
    TESTBENCH_PASSWORD=
    ```

1. Start the server

    ```bash
    python -u appserver.py
    ```
### Client

1. Install requirements

    ```bash
    cd client
    npm install
    ```

1. Start the project

    ```bash
    npm run dev
    ```

