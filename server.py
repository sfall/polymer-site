"""Tornado server for Polymer todo app."""
import json
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.web import Application
from tornado.websocket import WebSocketHandler

socket_connections = []


class WSHandler(WebSocketHandler):

    def check_origin(self, origin):
        return True

    def open(self):
        print("Opened a connection")
        socket_connections.append(self)

    def on_message(self, message_str):
        print("Received message: ", str(message_str))
        # send message to all clients, including self
        for socket in socket_connections:
            socket.write_message(message_str)
        print("Broadcasted message")

    def on_close(self):
        print("Closed a connection")
        socket_connections.remove(self)


app = Application([(r'/ws', WSHandler)])
if __name__ == '__main__':
    http_server = HTTPServer(app)
    http_server.listen(8080)
    print("Starting Tornado server...")
    IOLoop.instance().start()
