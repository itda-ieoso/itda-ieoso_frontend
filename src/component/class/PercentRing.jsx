import PropTypes from "prop-types";
import styled from "styled-components";

const CircleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 14.5rem;
`;

const CircleSVG = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

const CircleBackground = styled.circle`
  fill: none;
  stroke: #dedede;
  stroke-width: 14;
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: var(--main-color);
  stroke-width: 14;
  stroke-dasharray: 314; /* 2 * Math.PI * R (R=50) */
  stroke-dashoffset: ${(props) => 314 - (314 * props.percent) / 100};
  transition: stroke-dashoffset 0.5s ease;
`;

const PercentageText = styled.div`
  position: absolute;
  font-size: 3.5rem;
  font-weight: bold;
  color: var(--main-color);
`;

const PercentRing = ({ percent }) => {
  return (
    <CircleContainer>
      <CircleSVG viewBox="0 0 120 120">
        <CircleBackground cx="60" cy="60" r="50" />
        <CircleProgress cx="60" cy="60" r="50" percent={percent} />
      </CircleSVG>
      <PercentageText>{percent}%</PercentageText>
    </CircleContainer>
  );
};

PercentRing.propTypes = {
  percent: PropTypes.number.isRequired, // percent는 필수 값이며 숫자 타입이어야 합니다.
};

export default PercentRing;
