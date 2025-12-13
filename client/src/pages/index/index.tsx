import React, { useState, useEffect } from 'react';

import {
  GlobalStyle,
  Container,
  Header,
  Nav,
  Logo,
  NavLinks,
  NavLink,
  MobileMenuBtn,
  HeroSection,
  HeroContent,
  HeroButtons,
  PrimaryButton,
  SecondaryButton,
  HeroImage,
  ClassesSection,
  ClassesGrid,
  ClassCard,
  ClassCardFooter,
  StatsSection,
  Footer,
  MainImg
} from './styles';
import { useNavigate } from 'react-router-dom';
import { CDN } from '@/constant';

interface ClassType {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  difficulty: number;
  instructor: string;
  image: string; // Reserved field, can be empty in practice
}

const pageName = "Version Demo"

const HomePage: React.FC = () => {

  const navigate = useNavigate(); // Initialize navigation method

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [classes, _setClasses] = useState<ClassType[]>([
    {
      id: 1,
      title: 'Basic Yoga Practice',
      description: 'Foundational yoga course for beginners, correct your movements through human key point recognition',
      duration: '30 mins',
      level: 'beginner',
      difficulty: 2,
      instructor: 'Coach Zhang',
      image: ''
    },
    {
      id: 2,
      title: 'Core Strength Training',
      description: 'Specialized core muscle training with real-time body key point recognition and movement guidance',
      duration: '45 mins',
      level: 'intermediate',
      difficulty: 3,
      instructor: 'Coach Li',
      image: ''
    },
    {
      id: 3,
      title: 'High-Intensity Interval Training',
      description: 'HIIT high-intensity training, optimize your exercise efficiency through AI key point analysis',
      duration: '25 mins',
      level: 'advanced',
      difficulty: 5,
      instructor: 'Coach Wang',
      image: ''
    },
    {
      id: 4,
      title: 'Pilates Shaping',
      description: 'Precise Pilates movement guidance with real-time posture correction based on body key points',
      duration: '40 mins',
      level: 'beginner',
      difficulty: 2,
      instructor: 'Coach Liu',
      image: ''
    }
  ]);

  const startDetect = () => {
    navigate("/version")
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        mobileMenuOpen &&
        !target.closest('[data-mobile-menu]') &&
        !target.closest('.mobile-menu-btn')
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
      <GlobalStyle />

      {/* Header Navigation */}
      <Header>
        <Container>
          <Nav>
            <Logo>
              {/* Play icon placeholder */}
              <span className="icon-placeholder play"></span>
              <span>version</span>Demo
            </Logo>

            <NavLinks open={mobileMenuOpen} data-mobile-menu>
              <NavLink href="#" className="active">Home</NavLink>
              <NavLink href="#">Course Library</NavLink>
              <NavLink href="#">Training Plans</NavLink>
              <NavLink href="#">Data Analysis</NavLink>
              <NavLink href="#">About Us</NavLink>
            </NavLinks>

            <MobileMenuBtn
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {/* Menu/Close icon placeholder */}
              <span className={`icon-placeholder ${mobileMenuOpen ? 'close' : 'menu'}`}></span>
            </MobileMenuBtn>
          </Nav>
        </Container>
      </Header>

      {/* Hero Section */}
      <Container>
        <HeroSection>
          <HeroContent>
            <h1>
              AI-Powered <span>Human Key Point</span><br />
              Intelligent Workout System
            </h1>
            <p>
              Based on advanced human key point recognition technology, real-time analysis of your exercise posture,
              accurate correction of movement deviations, making every training session safe and effective.
            </p>
            <HeroButtons>
              <PrimaryButton onClick={startDetect}>
                <span className="icon-placeholder play"></span>
                Start Workout
              </PrimaryButton>
              <SecondaryButton>
                <span className="icon-placeholder chart"></span>
                View Data
              </SecondaryButton>
            </HeroButtons>
          </HeroContent>

          <HeroImage>
            <MainImg src={CDN + "/ai.png"}></MainImg>
          </HeroImage>
        </HeroSection>
      </Container>

      {/* Courses Section */}
      <Container>
        <ClassesSection>
          <h2>Featured <span>Workout Courses</span></h2>

          <ClassesGrid>
            {classes.map((cls) => (
              <ClassCard key={cls.id}>
                {/* Course image placeholder */}
                {/* <img src={cls.image} alt={cls.title} /> */}
                <div className="card-content">
                  <span className={`class-level ${cls.level}`}>
                    {cls.level === 'beginner' ? 'Beginner' :
                      cls.level === 'intermediate' ? 'Intermediate' : 'Advanced'}
                  </span>

                  <h3>{cls.title}</h3>
                  <p>{cls.description}</p>

                  <div style={{ height: "30px" }} className="class-meta"></div>

                  <ClassCardFooter>
                    <div className="difficulty">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <span
                          key={num}
                          className={num <= cls.difficulty ? 'active' : ''}
                        ></span>
                      ))}
                    </div>

                    <a href="#" className="start-btn">
                      Start Practice
                      <span className="icon-placeholder arrow-right"></span>
                    </a>
                  </ClassCardFooter>
                </div>
              </ClassCard>
            ))}
          </ClassesGrid>
        </ClassesSection>
      </Container>

      {/* Stats Section */}
      <StatsSection>
        <Container>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>100+</h3>
              <p>Professional Courses</p>
            </div>
            <div className="stat-item">
              <h3>98%</h3>
              <p>Movement Recognition Accuracy</p>
            </div>
            <div className="stat-item">
              <h3>50k+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Intelligent Guidance</p>
            </div>
          </div>
        </Container>
      </StatsSection>

      {/* Footer */}
      <Footer>
        <Container>
          <div className="footer-grid">
            <div className="footer-column">
              <h4>{pageName}</h4>
              <p>AI-powered human key point intelligent workout system, making exercise more scientific and effective.</p>
            </div>

            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Course Library</a></li>
                <li><a href="#">Training Plans</a></li>
                <li><a href="#">Data Analysis</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Follow Us</h4>
              <ul>
                <li><a href="#">WeChat Official Account</a></li>
                <li><a href="#">Douyin (TikTok)</a></li>
                <li><a href="#">Xiaohongshu (RED)</a></li>
                <li><a href="#">Bilibili</a></li>
              </ul>
            </div>
          </div>

          <div className="copyright">
            © {new Date().getFullYear()} {pageName} Intelligent Workout System - All Rights Reserved
          </div>
        </Container>
      </Footer>
    </>
  );
};

export default HomePage;