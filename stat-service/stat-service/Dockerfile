# syntax=docker/dockerfile:1
ARG PYTHON_VERSION=3.10
FROM python:${PYTHON_VERSION}-slim as base

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Linux Pakcages
RUN apt-get update && apt-get install -y \
    unixodbc iptables iproute2 gnupg curl \
    && apt-get clean

RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    && apt-get clean

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 80

# Run the application.
ENTRYPOINT ["gunicorn", "wsgi:app"]


