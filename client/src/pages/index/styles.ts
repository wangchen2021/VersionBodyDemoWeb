import styled, { createGlobalStyle, keyframes } from 'styled-components';

// 动画效果
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

export const MainImg = styled.img`

`

// 全局样式
export const GlobalStyle = createGlobalStyle`

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    color: inherit;
  }

  :root {
    --primary: #3B82F6;
    --primary-dark: #2563EB;
    --secondary: #10B981;
    --accent: #F59E0B;
    --dark: #1E293B;
    --light: #F8FAFC;
    --gray: #94A3B8;
    --gray-dark: #64748B;
    --bg: #F8FAFC;
    --text: #1E293B;
    --card: #FFFFFF;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  /* 图标占位样式 */
  .icon-placeholder {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background-color: currentColor;
    color: inherit;
    position: relative;

    &.play {
      clip-path: polygon(0 0, 0 100%, 100% 50%);
      width: 16px;
      height: 16px;
    }

    &.menu {
      &::before, &::after {
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        height: 4px;
        background-color: currentColor;
        border-radius: 2px;
      }
      &::before { top: 0; }
      &::after { bottom: 0; }
    }

    &.close {
      &::before, &::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 80%;
        height: 3px;
        background-color: currentColor;
        border-radius: 2px;
      }
      &::before { transform: translate(-50%, -50%) rotate(45deg); }
      &::after { transform: translate(-50%, -50%) rotate(-45deg); }
    }

    &.user {
      border-radius: 50%;
      width: 16px;
      height: 16px;
    }

    &.calendar {
      width: 18px;
      height: 18px;
      border: 2px solid currentColor;
      border-radius: 2px;
      &::before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: calc(100% - 4px);
        height: 4px;
        background-color: currentColor;
      }
    }

    &.arrow-right {
      clip-path: polygon(0 0, 0 100%, 100% 50%);
      transform: scaleX(0.6);
      width: 12px;
      height: 12px;
    }

    &.chart {
      width: 18px;
      height: 18px;
      position: relative;
      &::before, &::after, &::nth-child(3) {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 3px;
        background-color: currentColor;
        border-radius: 1px;
      }
      &::before { height: 60%; left: 0; }
      &::after { height: 90%; left: 6px; }
      &::nth-child(3) { height: 40%; left: 12px; }
    }
  }
`;

// 布局组件
export const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  background-color: var(--card);
  box-shadow: var(--shadow);
  z-index: 100;
  padding: 1rem 0;
`;

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    position: relative;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--primary);

  span {
    color: var(--text);
  }

  .icon-placeholder {
    color: var(--primary);
  }
`;

export const NavLinks = styled.div<{ open: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 250px;
    background-color: var(--card);
    flex-direction: column;
    padding: 4rem 2rem;
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    transform: translateX(${props => props.open ? '0' : '100%'});
    transition: transform 0.3s ease-in-out;
    z-index: 99;
  }
`;

export const NavLink = styled.a`
  font-weight: 500;
  color: var(--gray-dark);
  transition: color 0.2s;

  &:hover {
    color: var(--primary);
  }

  &.active {
    color: var(--primary);
    font-weight: 600;
  }
`;

export const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--bg);
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    background-color: var(--gray); /* 头像占位背景 */
  }
`;

export const MobileMenuBtn = styled.button`
  display: none;
  font-size: 1.5rem;
  color: var(--text);

  @media (max-width: 768px) {
    display: block;
    z-index: 100;
  }
`;

// 英雄区组件
export const HeroSection = styled.section`
  padding: 4rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 2rem 0;
  }
`;

export const HeroContent = styled.div`
  animation: ${fadeIn} 0.8s ease-out;

  h1 {
    font-size: 3rem;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    color: var(--text);

    span {
      color: var(--primary);
    }

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.1rem;
    color: var(--gray-dark);
    margin-bottom: 2rem;
    max-width: 500px;

    @media (max-width: 768px) {
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

export const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const PrimaryButton = styled.button`
  background-color: var(--primary);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: var(--primary-dark);
    animation: ${pulse} 0.6s ease-in-out;
  }

  .icon-placeholder {
    color: white;
  }
`;

export const SecondaryButton = styled.button`
  background-color: transparent;
  color: var(--text);
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid var(--gray);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  .icon-placeholder {
    color: inherit;
  }
`;

export const HeroImage = styled.div`
  animation: ${float} 3s ease-in-out infinite;
  display: flex;
  justify-content: center;
  width: 300px;
  margin-left: 100px;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    background-color: var(--gray); /* 图片占位背景 */
    min-height: 300px; /* 保证占位高度 */
    object-fit: cover;
  }

  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;

// 课程区组件
export const ClassesSection = styled.section`
  padding: 4rem 0;

  h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 3rem;
    color: var(--text);

    span {
      color: var(--primary);
    }
  }
`;

export const ClassesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

export const ClassCard = styled.div`
  background-color: var(--card);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.2s, box-shadow 0.2s;
  animation: ${fadeIn} 0.8s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    background-color: var(--gray); /* 课程图片占位背景 */
  }

  .card-content {
    padding: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  .class-meta {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    color: var(--gray-dark);
    font-size: 0.9rem;
    align-items: center;
  }

  .class-level {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 1rem;

    &.beginner {
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--secondary);
    }

    &.intermediate {
      background-color: rgba(245, 158, 11, 0.1);
      color: var(--accent);
    }

    &.advanced {
      background-color: rgba(239, 68, 68, 0.1);
      color: #EF4444;
    }
  }
`;

export const ClassCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;

  .difficulty {
    display: flex;
    gap: 2px;

    span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--gray);

      &.active {
        background-color: var(--primary);
      }
    }
  }

  .start-btn {
    color: var(--primary);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color 0.2s;

    &:hover {
      color: var(--primary-dark);
    }

    .icon-placeholder {
      color: inherit;
    }
  }
`;

// 统计区组件
export const StatsSection = styled.section`
  padding: 4rem 0;
  background-color: var(--primary);
  color: white;
  margin: 4rem 0;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    text-align: center;
  }

  .stat-item {
    animation: ${fadeIn} 0.8s ease-out;

    h3 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    p {
      opacity: 0.9;
      font-size: 1.1rem;
    }
  }
`;

// 页脚组件
export const Footer = styled.footer`
  background-color: var(--dark);
  color: var(--gray);
  padding: 4rem 0 2rem;

  .footer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .footer-column {
    h4 {
      color: white;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    ul {
      list-style: none;

      li {
        margin-bottom: 0.75rem;

        a {
          color: var(--gray);
          transition: color 0.2s;

          &:hover {
            color: var(--primary);
          }
        }
      }
    }
  }

  .copyright {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    font-size: 0.9rem;
  }
`;