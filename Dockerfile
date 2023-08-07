FROM python:3.11-slim-buster

# Install dependencies
COPY requirements.txt /tmp/
RUN py -m pip install --requirement /tmp/requirements.txt

COPY . /app
WORKDIR /app

# Run the application on port 5000
EXPOSE 5000
CMD ["py", "app.py"]

#Build docker image: docker build -t keras_flask_app .
#Run docker image: docker run -it --rm -p 5000:5000 keras_flask_app
