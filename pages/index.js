import {
  useEffect
} from 'react';
import { useRouter } from 'next/router';

import ContainerFullscreen from '../src/components/container/fullscreen';
import Logo from '../src/components/icon/logo';
import Head from '../src/components/head/index';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
      const timeoutReference = setTimeout(function () {
          router.push(`/home`);
      }, 2000);

    return () => clearTimeout(timeoutReference);
  }, []);

  return (
      <ContainerFullscreen>
        <Head />
        <Logo />
      </ContainerFullscreen>
  );
};

export default Index;
