import React from "react";
// Adjust the image path if necessary based on your project structure
// Assuming based on previous file content: '../../../src/assets/images/logos/ELTA@I.svg'
import alefittlogo from '../../../../../assets/images/logo.webp';
import styles from '../SubscriptionHistory.module.scss';
import { Paper } from "@mui/material";

export interface InvoiceTemplateProps {
    date: string;
    name: string;
    memberId: string;
    email: string;
    mobileNumber: string;
    address?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    plantype: string;
    planname: string;
    startdate: string;
    enddate: string;
    orginamt: number;
    offer: number;
    amount: number;
    currency: string;
}

const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>((props, ref) => {
    // Safety check for numbers
    const originAmt = Number(props.orginamt) || 0;
    const offerPct = Number(props.offer) || 0;
    const currency = props.currency === 'usd' ? '$' : '₹';
    // Calculate details
    // If offer is percentage:
    let offerAmountVal = originAmt * (offerPct / 100);
    let offerAmount = currency + offerAmountVal.toFixed(2);

    // If needed, we can also ensure total amount matches logic:
    // const totalAmount = originAmt - offerAmountVal;

    return (
        <Paper elevation={3} className="p-4">
            <div className={styles['receipt-container']} ref={ref}>
                <div className={styles.logoemail}>
                    <img src={alefittlogo} alt="ELTAI Logo" className="logImg" />
                </div>

                <div className={styles['header-content']}>
                    <h3>Alefit</h3>
                    {/* <p>156, SIDCO Nagar Main Road, Villivakkam, Chennai, Tamil Nadu, India - 600049</p> */}
                    <div className={styles['contact-info']}>
                        <div>
                            <strong>Email:</strong> <a href="mailto:alefit@gmail.com">alefit@gmail.com</a>
                        </div>
                        <div className={styles.changeLabelStyle}>
                            <strong>Mobile:</strong> +91-9344425159
                        </div>
                    </div>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.title}> Invoice</div>
                <table className={styles['receipt-details']}>
                    <tbody>
                        <tr>
                            <td className={styles.label}>Date:</td>
                            <td className={styles.field}>{props.date}</td>
                        </tr>
                        <tr>
                            <td className={styles.label}>Issued to:</td>
                            <td className={styles.field} colSpan={3}>{props.name}</td>
                        </tr>
                        <tr>
                            <td className={styles.label}>Issued for:</td>
                            <td className={styles.field} colSpan={3}>{props.plantype} – New</td>
                        </tr>
                        <tr>
                            <td className={styles.label}>Address:</td>
                            <td className={styles.field} colSpan={3}>
                                {props.address}
                                {props.city && `, ${props.city}`}
                                {props.district && `, ${props.district}`}
                                {props.state && `, ${props.state}`}
                                {props.country && `, ${props.country}`}
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.label}>Mobile:</td>
                            <td className={styles.field}>{props.mobileNumber}</td>
                        </tr>
                        <tr>
                            <td className={styles.label}>Email:</td>
                            <td className={styles.field}>{props.email}</td>
                        </tr>
                    </tbody>
                </table>

                <table className={styles['membership-table']}>
                    <thead>
                        <tr>
                            <th>Subscription Details</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {props.plantype} <br /> {props.planname} <br /> Duration from {props.startdate} to {props.enddate}
                            </td>
                            <td>1</td>
                            <td>{currency} {originAmt}</td>
                        </tr>
                        <tr>
                            <th className={styles.discount}>Discounts</th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <td className={styles.membership}> {props.plantype}</td>
                            <td> {props.offer}%</td>
                            <td>{offerAmount}</td>
                        </tr>
                        <tr>
                            <td className={styles.membership}>Renewal Discount, if renewal</td>
                            <td>-</td>
                            <td>- </td>
                        </tr>
                        <tr>
                            <td colSpan={2} className={`${styles['total-payable']} text-end`}>Total Payable</td>
                            <td className={styles['final-amount']}>{currency} {props.amount}</td>
                        </tr>
                    </tbody>
                </table>
                {/* <h3>Our Account Details:</h3>
            <table className={styles['payment-table']}>
                <tbody>
                    <tr>
                        <td className={styles.label}>
                            <strong>Account Name:</strong>
                        </td>
                        <td>ELTAI (English Language Teachers’ Association of India)</td>
                    </tr>
                    <tr>
                        <td className={styles.label}>
                            <strong>Bank & Branch:</strong>
                        </td>
                        <td>SBI, Villivakkam Branch, Chennai</td>
                    </tr>
                    <tr>
                        <td className={styles.label}>
                            <strong>Savings Account No:</strong>
                        </td>
                        <td>30870397943</td>
                    </tr>
                    <tr>
                        <td className={styles.label}>
                            <strong>IFSC Code:</strong>
                        </td>
                        <td>SBIN0007108</td>
                    </tr>
                </tbody>
            </table> */}
                {/* <h4 className="mt-3"><strong>Important Instructions</strong></h4>
            <p>
                The membership fee can be paid via cash, cheque, demand draft (DD), or internet bank transfer. Please send the
                cheque/DD/transaction details to our office by post. Ensure that the invoice number is mentioned in the
                transaction reference. For any queries, feel free to contact us at the provided email.
            </p> */}
                <div className={styles.authorised}>
                    <p className="mb-1">Authorised by</p>
                    <p className="mb-1">
                        <strong>Alefit</strong>
                    </p>
                    {/* <p className="mb-1">National Secretary, ELTAI</p> */}
                    <div className={styles.divider}></div>
                </div>
                <div className={styles.note}>
                    Thank you for your interest in taking a membership of Alefit. We are excited to have you as part of our growing
                    community. Please visit <a href="https://www.alefitt.in">www.alefitt.in</a> to explore the benefits and resources
                    available to you. If you have any questions, contact us at
                    <a href="mailto:alefitt@gmail.com">alefitt@gmail.com</a> or at <strong>+91-9344425159</strong>.
                </div>
            </div>  </Paper>

    );
});

export default InvoiceTemplate;
