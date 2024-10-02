import React, { useEffect, useRef } from "react";
import useWebsocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { Cursor } from "./Cursor";

const renderCursors = users => {
  return Object.keys(users).map(uuid => {
    const user = users[uuid];
    return <Cursor key={uuid} point={[user.state.x, user.state.y]} />
  })
}

const renderUsersList = users => {
  return <ul>
    {Object.keys(users).map(uuid => {
      return <li key={uuid}>{JSON.stringify(users[uuid])}</li>
    })}
  </ul>
}
export default function Home({ username }) {
	const ws_url = "ws://localhost:8000";
	const THROTTLE = 5;
	const { sendJsonMessage, lastJsonMessage } = useWebsocket(ws_url, {
		queryParams: {
			username,
		},
	});
	const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

  useEffect(() => {
    sendJsonMessage({
      x: 0,
      y:0
    })
		window.addEventListener("mousemove", e => {
			sendJsonMessageThrottled.current({
				x: e.clientX,
				y: e.clientY,
			});
    });
    
  }, []);
  if (lastJsonMessage) {
    return <>
      {renderCursors(lastJsonMessage)}
      {renderUsersList(lastJsonMessage)}
    </>
  }
	return (
		<>
			<h1>Hello, {username}</h1>
		</>
	);
}
