var pubsub = (function () {
  "use strict";

  var ws,
    pid = Math.round(Math.random() * 1000).toString(),
    server = "ws://localhost:8080/ws";

  function open() {
    if (typeof ws !== "undefined") {
      ws.close();
    }
    console.log("Connecting to server...");
    ws = new WebSocket(server);
    ws.onopen = function () {
      var message = JSON.stringify({
        type: "presence",
        user: pid,
        value: "open"
      });
      ws.send(message);
      console.log("Sent a presence message:");
      console.log(message);
    };
    ws.onmessage = function (evt) {
      console.log("Received message:");
      console.log(evt.data);
      var receipt = new CustomEvent("receipt", {detail: JSON.parse(evt.data)});
      window.dispatchEvent(receipt);
    };
    ws.onclose = function (evt) {
      var receipt, message = {
        type: "presence",
        user: pid,
        value: "close"
      };
      receipt = new CustomEvent("receipt", {detail: message});
      window.dispatchEvent(receipt);
    };
  }

  function publish(message) {
    ws.send(JSON.stringify(message));
  }

  function setServer(newServer) {
    server = newServer;
  }

  return {
    open: open,
    publish: publish,
    setServer: setServer
  };
}());
