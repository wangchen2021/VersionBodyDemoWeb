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
  image: string; // 保留字段，实际可留空
}

const pageName = "Version Demo"

const HomePage: React.FC = () => {

  const navigate = useNavigate(); // 初始化导航方法

  // 移动端菜单状态
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [classes, _setClasses] = useState<ClassType[]>([
    {
      id: 1,
      title: '基础瑜伽跟练',
      description: '适合初学者的瑜伽基础课程，通过人体关键点识别纠正你的动作',
      duration: '30分钟',
      level: 'beginner',
      difficulty: 2,
      instructor: '张教练',
      image: ''
    },
    {
      id: 2,
      title: '核心力量训练',
      description: '针对核心肌群的专项训练，实时识别身体关键点并指导动作',
      duration: '45分钟',
      level: 'intermediate',
      difficulty: 3,
      instructor: '李教练',
      image: ''
    },
    {
      id: 3,
      title: '高强度间歇训练',
      description: 'HIIT高强度训练，通过AI关键点分析优化你的运动效率',
      duration: '25分钟',
      level: 'advanced',
      difficulty: 5,
      instructor: '王教练',
      image: ''
    },
    {
      id: 4,
      title: '普拉提塑形',
      description: '精准的普拉提动作指导，基于身体关键点实时纠正姿势',
      duration: '40分钟',
      level: 'beginner',
      difficulty: 2,
      instructor: '刘教练',
      image: ''
    }
  ]);

  const startDetect = () => {
    navigate("/version")
  }

  // 点击外部关闭移动端菜单
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

      {/* 头部导航 */}
      <Header>
        <Container>
          <Nav>
            <Logo>
              {/* 播放图标占位 */}
              <span className="icon-placeholder play"></span>
              <span>version</span>Demo
            </Logo>

            <NavLinks open={mobileMenuOpen} data-mobile-menu>
              <NavLink href="#" className="active">首页</NavLink>
              <NavLink href="#">课程库</NavLink>
              <NavLink href="#">训练计划</NavLink>
              <NavLink href="#">数据分析</NavLink>
              <NavLink href="#">关于我们</NavLink>
            </NavLinks>

            <MobileMenuBtn
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {/* 菜单/关闭图标占位 */}
              <span className={`icon-placeholder ${mobileMenuOpen ? 'close' : 'menu'}`}></span>
            </MobileMenuBtn>
          </Nav>
        </Container>
      </Header>

      {/* 英雄区 */}
      <Container>
        <HeroSection>
          <HeroContent>
            <h1>
              AI驱动的<span>人体关键点</span><br />
              智能跟练系统
            </h1>
            <p>
              基于先进的人体关键点识别技术，实时分析你的运动姿势，
              精准纠正动作偏差，让每一次训练都安全有效。
            </p>
            <HeroButtons>
              <PrimaryButton onClick={startDetect}>
                <span className="icon-placeholder play"></span>
                开始跟练
              </PrimaryButton>
              <SecondaryButton>
                <span className="icon-placeholder chart"></span>
                查看数据
              </SecondaryButton>
            </HeroButtons>
          </HeroContent>

          <HeroImage>
            <MainImg src={CDN + "/ai.png"}></MainImg>
          </HeroImage>
        </HeroSection>
      </Container>

      {/* 课程展示区 */}
      <Container>
        <ClassesSection>
          <h2>精选<span>跟练课程</span></h2>

          <ClassesGrid>
            {classes.map((cls) => (
              <ClassCard key={cls.id}>
                {/* 课程图片占位 */}
                {/* <img src={cls.image} alt={cls.title} /> */}
                <div className="card-content">
                  <span className={`class-level ${cls.level}`}>
                    {cls.level === 'beginner' ? '入门级' :
                      cls.level === 'intermediate' ? '进阶级' : '专家级'}
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
                      开始练习
                      <span className="icon-placeholder arrow-right"></span>
                    </a>
                  </ClassCardFooter>
                </div>
              </ClassCard>
            ))}
          </ClassesGrid>
        </ClassesSection>
      </Container>

      {/* 数据统计区 */}
      <StatsSection>
        <Container>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>100+</h3>
              <p>专业课程</p>
            </div>
            <div className="stat-item">
              <h3>98%</h3>
              <p>动作识别准确率</p>
            </div>
            <div className="stat-item">
              <h3>50k+</h3>
              <p>活跃用户</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>智能指导</p>
            </div>
          </div>
        </Container>
      </StatsSection>

      {/* 页脚 */}
      <Footer>
        <Container>
          <div className="footer-grid">
            <div className="footer-column">
              <h4>{pageName}</h4>
              <p>AI驱动的人体关键点智能跟练系统，让运动更科学、更有效。</p>
            </div>

            <div className="footer-column">
              <h4>快速链接</h4>
              <ul>
                <li><a href="#">首页</a></li>
                <li><a href="#">课程库</a></li>
                <li><a href="#">训练计划</a></li>
                <li><a href="#">数据分析</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>支持</h4>
              <ul>
                <li><a href="#">帮助中心</a></li>
                <li><a href="#">常见问题</a></li>
                <li><a href="#">联系我们</a></li>
                <li><a href="#">隐私政策</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>关注我们</h4>
              <ul>
                <li><a href="#">微信公众号</a></li>
                <li><a href="#">抖音</a></li>
                <li><a href="#">小红书</a></li>
                <li><a href="#">B站</a></li>
              </ul>
            </div>
          </div>

          <div className="copyright">
            © {new Date().getFullYear()} {pageName} 智能跟练系统 - 保留所有权利
          </div>
        </Container>
      </Footer>
    </>
  );
};

export default HomePage;