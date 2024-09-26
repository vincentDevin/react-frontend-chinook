import MainLayout from './MainLayout';
import HeroSection from '../components/HeroSection';
import RandomHighlights from '../components/RandomHighlights';
import { useDocTitle } from '../useDocTitle';

const HomePage = () => {
    useDocTitle('Home - Music Database App');

    return (
        <MainLayout>
            <HeroSection />
            <RandomHighlights />
        </MainLayout>
    );
};

export default HomePage;
