import MainLayout from './MainLayout';
import HeroSection from '../components/HeroSection';
import FeatureHighlights from '../components/FeatureHighlights';
import RandomSpotlight from '../components/RandomSpotlight';
import { useDocTitle } from '../useDocTitle';

const HomePage = () => {
    useDocTitle('Home - Music Database App');

    return (
        <MainLayout>
            <HeroSection />
            <FeatureHighlights />
            <RandomSpotlight />
        </MainLayout>
    );
};

export default HomePage;
