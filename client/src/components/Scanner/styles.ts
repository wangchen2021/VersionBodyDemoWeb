import styled from "styled-components";
export const ScannerContainer = styled.div`
    position: absolute;
    left: 50%;
    top: 0;
    width: 100%;
    height: 100%;
    transform: translateX(-50%);
    z-index: 2;

    .progress{
        position: absolute;
        left: 0;
        top: 30%;
        width: 100%;
        height: 15px;
        border-radius: 20px;
          /* 扫描渐变核心：从透明→主色→透明，横向渐变 */
        background: linear-gradient(
            90deg,
            rgba(92, 255, 92, 0) 0%,    /* 左侧透明 */
          rgba(92, 255, 92, 0.6) 50%,  /* 中间高亮（原颜色透明度） */
            rgba(92, 255, 92, 0) 100%    /* 右侧透明 */
        );
         /* 可选：加一层底色，让渐变更明显 */
        background-color: rgba(92, 255, 92, 0.2);
    }
`