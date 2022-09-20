import { Landing } from '../components/Landing/Landing';

export default function HomePage() {
  return (
    <>
      <Landing />
    </>
  );
}

export async function getStaticProps() {
  const { GEO_API_KEY } = process.env;
  const { GEO_API_HOST } = process.env;
  return {
    props: {
      GEO_API_KEY,
      GEO_API_HOST,
    },
  };
}
