import PropTypes from "prop-types";
import styled from "styled-components";

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const ProgressText = styled.div`
  display: flex;
  align-items: baseline;
  font-size: 5rem;
  font-weight: bold;
  color: var(--main-color);
  white-space: nowrap;

  span {
    font-size: 2.1rem;
    color: #cdcdcd;
    margin-left: 0.3rem;
  }
`;

const ProgressBarWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 1rem;
  background-color: #cdcdcd;
  border-radius: 21px;
  margin-top: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: ${(props) => props.percent || 0}%;
  height: 100%;
  background-color: var(--main-color);
  transition: width 0.3s ease;
  border-radius: 21px;
`;

const PercentBar = ({ percent }) => {
  return (
    <ProgressContainer>
      <ProgressText>
        {percent}% <span>/ 100%</span>
      </ProgressText>
      <ProgressBarWrapper>
        <ProgressFill percent={percent} />
      </ProgressBarWrapper>
    </ProgressContainer>
  );
};

PercentBar.propTypes = {
  percent: PropTypes.number.isRequired,
};

export default PercentBar;
