import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RTei1BF3PD2V9Eklljc1mkZVXO7sABSR8DQPbNhkWsCFGbIKFHVQh4w0O8TWJLeAuOH13osjOfFLM1ygSLjl4vg00FLFXbbk1');

export const StripeWrapper:React.FC<{children: React.ReactNode}> = ({children}) => {
    const options = {
        // passing the client secret obtained from the server
        clientSecret: 'pk_test_51RTei1BF3PD2V9Eklljc1mkZVXO7sABSR8DQPbNhkWsCFGbIKFHVQh4w0O8TWJLeAuOH13osjOfFLM1ygSLjl4vg00FLFXbbk1',
      };
    return <Elements stripe={stripePromise} options={options}>
        {children}
    </Elements>
}

