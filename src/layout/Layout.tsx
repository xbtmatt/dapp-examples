import React, { useEffect, useState } from "react";
import { useStore } from "../state/StateStorage";
import { createGlobalStyle } from "styled-components";
import { AppContext as AptosWalletProvider } from "../wallet/AppContext";

const GlobalStyles = createGlobalStyle`
	html {
		--color-background-neutral: rgb(38, 56, 77);
		--color-background-neutral-highlight: rgb(51, 69, 90);
		--color-text: white;
		--color-text-detail: rgb(71, 71, 71);
		--background-light-blue-gradient: linear-gradient(to right, rgb(81, 111, 150) 0%, rgb(123, 171, 241) 100%);
		--background-error-gradient: linear-gradient(to top right, rgba(255, 111, 77, 0.9) 0%, rgba(255, 131, 131, 0.9) 100%);
		--background-neutral-gradient: linear-gradient(to top right, rgb(38, 56, 77) 0%, rgb(61, 79, 100) 100%);
		--background-dark-neutral-gradient: linear-gradient(to top right, rgb(18, 36, 57) 0%, rgb(41, 59, 80) 100%);
		--background-darker-neutral-gradient: linear-gradient(to top right, rgb(11, 14, 19) 0%, rgb(21, 32, 38) 100%);
		--background-darkest-neutral-gradient: linear-gradient(to top right, rgb(1, 2, 3) 0%, rgb(15, 18, 21) 100%);
		--green-gradient: 	linear-gradient(to top, rgba(30, 128, 22, 1) 0%, rgba(71, 181, 41, 1) 100%);
		--light-green-gradient: 	linear-gradient(to top right, rgba(30, 98, 22, 1) 0%, rgba(71, 141, 41, 1) 30%);
		--light-green-gradient2: 	linear-gradient(to top right, rgba(10, 111, 11, 1) 0%, rgba(41, 131, 21, 1) 100%);
		--light-green-gradient-transparent: 	linear-gradient(to top right, rgba(30, 98, 22, 0.81) 0%, rgba(71, 141, 41, 0.51) 100%);
    --light-blue-gradient-transparent: linear-gradient(45deg, rgba(91, 121, 191, 0.51) 0%, rgba(191, 211, 255, 0.51) 100%);
    --red-gradient: linear-gradient(to top right, rgba(181, 12, 21) 0%, rgba(255, 40, 46) 100%);
		--light-green-flat: rgba(71, 181, 41, 1);
    --deep-ocean-gradient: linear-gradient(to top right, rgba(0, 35, 71, 0.81) 0%, rgba(0, 50, 91, 0.81) 100%);
    --deep-ocean-gradient2: linear-gradient(to top right, rgba(0, 35, 71, 0.57) 0%, rgba(0, 50, 91, 0.71) 100%);
    --light-blue-gradient: linear-gradient(to top, rgba(151, 151, 211) 0%, rgba(171, 171, 231) 100%);
    --light-blue-gradient-faded: linear-gradient(to top, rgba(151, 151, 211, 0.81) 0%, rgba(171, 171, 231, 0.81) 81%);
    --light-blue-gradient2: linear-gradient(to right, rgba(151, 151, 211) 0%, rgba(41, 59, 80) 100%);
    --hot-pink: rgba(211, 51, 158, 1);
    --hot-pink-transparent: rgba(211, 51, 158, 0.31);
    --hot-pink-gradient: linear-gradient(to top, rgba(141, 11, 108, 1) 0%, rgba(211, 51, 158, 1) 100%);
		--sexy-shadows: -0.5px 0.5px 0.3px rgba(0, 0, 0, 0.04),
			-1.1px 1.1px 0.7px rgba(0, 0, 0, 0.055),
			-1.8px 1.8px 1.2px rgba(0, 0, 0, 0.064),
			-2.7px 2.7px 1.8px rgba(0, 0, 0, 0.071),
			-3.9px 3.9px 2.6px rgba(0, 0, 0, 0.077),
			-5.5px 5.5px 3.7px rgba(0, 0, 0, 0.083),
			-7.8px 7.8px 5.3px rgba(0, 0, 0, 0.089);
		--big-shadows: -0.5px 0.5px 0.3px rgba(0, 0, 0, 0.1),
			-1.1px 1.1px 0.7px rgba(0, 0, 0, 0.115),
			-1.8px 1.8px 1.2px rgba(0, 0, 0, 0.124),
			-2.7px 2.7px 1.8px rgba(0, 0, 0, 0.131),
			-3.9px 3.9px 2.6px rgba(0, 0, 0, 0.137),
			-5.5px 5.5px 3.7px rgba(0, 0, 0, 0.142),
			-7.8px 7.8px 5.3px rgba(0, 0, 0, 0.146);
		--no-shadows: -0.5px 0.5px 0.3px rgba(0, 0, 0, 0),
			-1.1px 1.1px 0.7px rgba(0, 0, 0, 0),
			-1.8px 1.8px 1.2px rgba(0, 0, 0, 0),
			-2.7px 2.7px 1.8px rgba(0, 0, 0, 0),
			-3.9px 3.9px 2.6px rgba(0, 0, 0, 0),
			-5.5px 5.5px 3.7px rgba(0, 0, 0, 0),
			-7.8px 7.8px 5.3px rgba(0, 0, 0, 0);
    --red-glow: 0px 0px 11px 0.5px rgba(255, 1, 1, 0.51),
    0px 0px 9px 0.5px rgba(255, 1, 1, 0.51),
    0px 0px 7px 0.5px rgba(255, 1, 1, 0.51);
    --green-glow: 0px 0px 11px 0.5px rgba(45, 255, 21, 0.51),
    0px 0px 9px 0.5px rgba(45, 255, 21, 0.51),
    0px 0px 7px 0.5px rgba(45, 255, 21, 0.51);
    --red-glow-color: rgba(255, 1, 1, 0.81);
    --blue-glow-color: rgba(111, 131, 255, 0.81);
    --grey-glow-color: rgba(171, 171, 171, 0.61);
    --green-glow-color: rgba(45, 255, 21, 0.71);
    --white-glow-color: rgba(255, 255, 255, 0.81);
    --red-text-color: rgba(255, 1, 1, 1);
    --blue-text-color: rgba(111, 131, 255, 1);
    --grey-text-color: rgba(171, 171, 171, 1);
    --green-text-color: rgba(45, 255, 21, 1);
    --white-text-color: rgba(255, 255, 255, 1);

    @media (min-width: 2200px) { --checkmark-margin: 1.5ch; }
    @media (max-width: 2200px) { --checkmark-margin: 1.4ch; }
    @media (max-width: 2000px) { --checkmark-margin: 1.3ch; }
    @media (max-width: 1600px) { --checkmark-margin: 1.2ch; }
    @media (max-width: 1080px) { --checkmark-margin: 1.1ch; }
    @media (max-width: 800px)  { --checkmark-margin: 1ch; }
    @media (max-width: 600px)  { --checkmark-margin: 1ch; }
    @media (max-width: 400px)  { --checkmark-margin: 1ch; }
    @media (max-width: 300px)  { --checkmark-margin: 1ch; }
    @media (max-width: 200px)  { --checkmark-margin: 1ch; }
    

		--inset-black-shadow: inset 0px 0px 11px 3px rgba(0, 0, 0, 0.71);
    --big-button-height: 81px;
    --medium-button-height: 66px;
    --small-button-height: 51px;
	}
`;


const Layout = (props: any) => {

	const [postRender, setPostRender] = useState<boolean>(false);

	useEffect(() => {
		//const aptosClient = new AptosClient(`${process.env.NEXT_PUBLIC_NODE_URL}`);
		//const tokenClient = new TokenClient(aptosClient);

		setPostRender(true);
		//setAptosClient(aptosClient);
		//setTokenClient(tokenClient);
	}, []);

	return (
		<>
			<GlobalStyles />
			{postRender ?
				<AptosWalletProvider>
					{props.children}
				</AptosWalletProvider>
				:
				<>
					{props.children}
				</>}
		</>
	);
};

export default Layout;