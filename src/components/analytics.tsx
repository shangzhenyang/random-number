import type { JSX } from "react";
import { useEffect } from "react";
import ReactGA from "react-ga4";

function Analytics(): JSX.Element {
	useEffect(() => {
		setTimeout(() => {
			ReactGA.initialize("G-VLJ52KB4ZZ");
			ReactGA.send("pageview");
		}, 1000);
	}, []);

	return <></>;
}

export default Analytics;
