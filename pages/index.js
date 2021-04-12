import {
	useEffect
} from 'react';
import { useRouter } from 'next/router';

import ContainerFullscreen from '../src/components/container/fullscreen';
import Logo from '../src/components/icon/logo';
import Head from '../src/components/head/index';

const Index = ({
	baseApiUrl
}) => {
	const router = useRouter();

	useEffect(() => {
		// api call to check if there is information, if not the api service will create them
		async function checkData () {
			const responses = await fetch (`${baseApiUrl}/task`);
			router.push(`/home`);
		}
		checkData();

			/*const timeoutReference = setTimeout(function () {
					router.push(`/home`);
			}, 2000);*/

		// return () => clearTimeout(timeoutReference);
	}, []);

	return (
			<ContainerFullscreen>
				<Head />
				<Logo />
			</ContainerFullscreen>
	);
};

Index.defaultProps = {
	baseApiUrl: `/api`
};

export default Index;
