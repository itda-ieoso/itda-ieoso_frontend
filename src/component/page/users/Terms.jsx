import { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { Terms, Term, CustomCheckboxCircle, CustomCheckboxTransparent, ResponsiveLabel } from '../../../style/Styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TermsModal from './TermsModal';

const TERMS = {
  service: '[필수] itda 서비스 이용약관에 동의합니다.',
  privacy: '[필수] itda 개인정보 수집 및 이용약관에 동의합니다.',
  marketing: '[선택] itda의 마케팅 정보 수신에 동의합니다.'
};

function TermsAgreement({ isChecked, termsChecked, handleCheckAll, handleIndividualCheck }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const handleDocumentOpen = (term) => {
    let content;
    switch (term) {
      case 'service':
        content = {
          title: '서비스 이용약관',
          content: '회원의 의무: 회원은 서비스 신청 시 허위 정보를 제공하거나 타인의 정보를 도용해서는 안 됩니다.\n\n또한, 사이트에 게시된 정보를 허가 없이 변경하거나, 회사 및 제3자의 저작권 등 지식재산권을 침해하는 행위를 금지합니다.\n\n게시물 관리: 회원이 작성한 게시물의 권리와 책임은 작성자에게 있으며, 회사는 비방, 명예훼손, 저작권 침해 등의 문제가 있는 게시물을 사전 통지 없이 삭제할 수 있습니다.\n\n서비스 제공 및 변경: 회사는 상품 등의 품절 또는 기술적 사양의 변경 등의 사유로 제공할 상품 등의 내용을 변경할 수 있으며, 이 경우 변경 사항을 즉시 공지합니다.',
};
        break;
      case 'privacy':
        content = {
          title: '개인정보 처리방침',
          content: '수집 및 이용 목적: 회원 관리, 서비스 제공 및 개선, 고객 상담, 마케팅 및 광고에의 활용 등을 위해 개인정보를 수집합니다.\n\n 수집 항목: 이름, 이메일 주소, 전화번호, 생년월일, 성별, 서비스 이용 기록, 결제 정보 등이 포함됩니다. \n\n보유 및 이용 기간: 회원 탈퇴 시까지 또는 관련 법령에 따라 일정 기간 동안 보유합니다. 예를 들어, 회원 탈퇴 시 서비스 제공을 위해 수집한 정보는 소비자 불만 및 분쟁 해결 목적으로 탈퇴일로부터 30일간 보관 후 삭제됩니다.\n\n제3자 제공 및 위탁: 회사는 원칙적으로 회원의 동의 없이 개인정보를 외부에 제공하지 않으며, 서비스 운영을 위해 필요한 경우에 한해 수탁자에게 업무를 위탁할 수 있습니다. 예를 들어, 결제를 위한 업체나 배송을 위한 업체 등이 해당됩니다.등이 해당됩니다.',
        };
        break;
      case 'marketing':
        content = {
          title: '마케팅 정보 수신',
          content: '수집 및 이용 목적: 이벤트, 프로모션, 신규 서비스 안내 등 광고성 정보를 전자우편, 문자메시지, 앱 푸시 등을 통해 제공하기 위해 수집합니다.\n\n수집 항목: 이름, 이메일 주소, 전화번호, 서비스 이용 기록 등이 포함됩니다.\n\n보유 및 이용 기간: 서비스 이용 중 지속적인 보유 및 이용을 합니다. 회원 탈퇴 후 2년동안 itda에서 마케팅 정보에 보유 및 이용 기간: 서비스 이용 중 지속적인 보유 및 이용을 합니다. 회원 탈퇴 후 2년동안 itda에서 마케팅 정보에 대한 개인 정보 기록을 보유하고 이용합니다. 그 이후 모든 수집 사항은 즉시 폐기됩니다.\n\n동의 선택 및 철회: 회원은 마케팅 정보 수신에 대한 동의를 선택적으로 할 수 있으며, 동의하지 않더라도 서비스 이용에 제한이 없습니다. 또한, 동의 후에도 언제든지 동의를 철회할 수 있습니다.',
        };
        break;
      default:
        content = { title: '', content: '' };
    }
    setModalContent(content);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Terms>
      <Term>
        <FormControlLabel
          control={
            <Checkbox
              icon={CustomCheckboxCircle(false)}
              checkedIcon={CustomCheckboxCircle(true)}
              checked={isChecked}
              onChange={handleCheckAll}
            />
          }
          label={<ResponsiveLabel>전체 동의</ResponsiveLabel>}
        />
      </Term>
      <div style={{ borderBottom: '1px solid #CDCDCD', margin: '10px 0' }}></div>
      <Term>
        <FormControlLabel
          control={
            <Checkbox
              icon={CustomCheckboxTransparent(false)}
              checkedIcon={CustomCheckboxTransparent(true)}
              checked={termsChecked.service}
              onChange={() => handleIndividualCheck('service')}
            />
          }
          label={<ResponsiveLabel>{TERMS.service}</ResponsiveLabel>}
        />
        <IconButton onClick={() => handleDocumentOpen('service')}>
          <ArrowForwardIosIcon style={{ fontSize: '15px' }} />
        </IconButton>
      </Term>
      <Term>
        <FormControlLabel
          control={
            <Checkbox
              icon={CustomCheckboxTransparent(false)}
              checkedIcon={CustomCheckboxTransparent(true)}
              checked={termsChecked.privacy}
              onChange={() => handleIndividualCheck('privacy')}
            />
          }
          label={<ResponsiveLabel>{TERMS.privacy}</ResponsiveLabel>}
        />
        <IconButton onClick={() => handleDocumentOpen('privacy')}>
          <ArrowForwardIosIcon style={{ fontSize: '15px' }} />
        </IconButton>
      </Term>
      <Term>
        <FormControlLabel
          control={
            <Checkbox
              icon={CustomCheckboxTransparent(false)}
              checkedIcon={CustomCheckboxTransparent(true)}
              checked={termsChecked.marketing}
              onChange={() => handleIndividualCheck('marketing')}
            />
          }
          label={<ResponsiveLabel>{TERMS.marketing}</ResponsiveLabel>}
        />
        <IconButton onClick={() => handleDocumentOpen('marketing')}>
          <ArrowForwardIosIcon style={{ fontSize: '15px' }} />
        </IconButton>
      </Term>

      {modalOpen && (
        <TermsModal 
          title={modalContent.title} 
          content={modalContent.content} 
          onClose={handleCloseModal}
        />
      )}
    </Terms>
  );
}

TermsAgreement.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  termsChecked: PropTypes.shape({
    service: PropTypes.bool.isRequired,
    privacy: PropTypes.bool.isRequired,
    marketing: PropTypes.bool.isRequired,
  }).isRequired,
  handleCheckAll: PropTypes.func.isRequired,
  handleIndividualCheck: PropTypes.func.isRequired,
};

export default TermsAgreement;
