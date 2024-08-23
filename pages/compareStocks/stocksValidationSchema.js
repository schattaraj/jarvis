import * as Yup from 'yup';

export const stocksValidationSchema = Yup.object().shape({
    stockA: Yup.string().test(
        'stock-pair',
        'You must select either stockA and stockB or stockC and stockD',
        function (value) {
          const { stockB, stockC, stockD } = this.parent;
          return (
            (value && stockB) || (stockC && stockD) || (!value && !stockB && !stockC && !stockD)
          );
        }
      ),
      stockB: Yup.string().test(
        'stock-pair',
        'You must select either stockA and stockB or stockC and stockD',
        function (value) {
          const { stockA, stockC, stockD } = this.parent;
          return (
            (value && stockA) || (stockC && stockD) || (!value && !stockA && !stockC && !stockD)
          );
        }
      ),
      stockC: Yup.string().test(
        'stock-pair',
        'You must select either stockA and stockB or stockC and stockD',
        function (value) {
          const { stockA, stockB, stockD } = this.parent;
          return (
            (value && stockD) || (stockA && stockB) || (!value && !stockA && !stockB && !stockD)
          );
        }
      ),
      stockD: Yup.string().test(
        'stock-pair',
        'You must select either stockA and stockB or stockC and stockD',
        function (value) {
          const { stockA, stockB, stockC } = this.parent;
          return (
            (value && stockC) || (stockA && stockB) || (!value && !stockA && !stockB && !stockC)
          );
        }
      ),
      startDate: Yup.date()
        .required('Start date is required')
        .max(new Date(), 'Start date cannot be in the future'),
      endDate: Yup.date()
        .required('End date is required')
        .max(new Date(), 'End date cannot be in the future')
        .min(Yup.ref('startDate'), 'End date cannot be before start date'),
});