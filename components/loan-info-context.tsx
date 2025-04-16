import { useDispatch, useSelector } from 'react-redux';
import { 
  selectLoanInfo, 
  updateSection, 
  resetLoanInfo,
  type LoanInfoState
} from '@/lib/redux/slices/loanInfoSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

// Create a hook to use loan info from Redux
export function useLoanInfo() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectLoanInfo);
  
  // Function to update a section of the loan info
  const updateFormData = (section: keyof LoanInfoState, data: any) => {
    dispatch(updateSection({ section, data }));
  };
  
  // Function to update multiple fields at once
  const updateMultipleFields = (data: Partial<LoanInfoState>) => {
    Object.entries(data).forEach(([section, sectionData]) => {
      dispatch(updateSection({ 
        section: section as keyof LoanInfoState, 
        data: sectionData 
      }));
    });
  };
  
  // Function to reset the loan info
  const resetForm = () => {
    dispatch(resetLoanInfo());
  };
  
  return { 
    formData, 
    updateFormData, 
    updateMultipleFields,
    resetForm
  };
}
