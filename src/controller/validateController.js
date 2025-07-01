import axios from "axios";
import {
  decryptDatanifi,
  encryptData,
  encryptDatanifi,
} from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";

const validateGST = async (req, res) => {
  try {
    const mockData = {
      address_details: {},
      einvoice_status: false,
      client_id: "corporate_gstin_orVgzqxrBPkFywethjNx",
      gstin: "07AAGCN9450Q1ZO",
      pan_number: "AAGCN9450Q",
      fy: null,
      business_name: "NERA SOFT AND FINSERV PRIVATE LIMITED",
      legal_name: "NERA SOFT AND FINSERV PRIVATE LIMITED",
      center_jurisdiction:
        "State - CBIC,Zone - DELHI,Commissionerate - DELHI EAST,Division - MAYUR VIHAR,Range - RANGE - 157",
      state_jurisdiction:
        "State - Delhi,Zone - Zone 7,Ward - Ward 84 (Jurisdictional Office)",
      date_of_registration: "2021-03-13",
      constitution_of_business: "Private Limited Company",
      taxpayer_type: "Regular",
      gstin_status: "Active",
      date_of_cancellation: "1800-01-01",
      field_visit_conducted: "No",
      nature_bus_activities: [
        "Supplier of Services",
        "Recipient of Goods or Services",
      ],
      nature_of_core_business_activity_code: "SPO",
      nature_of_core_business_activity_description:
        "Service Provider and Others",
      aadhaar_validation: "Yes",
      aadhaar_validation_date: "2024-10-22",
      filing_status: [],
      address:
        "B-1/64, STREET NO.3, NEW ASHOK NAGAR, East Delhi, Delhi, 110096",
      hsn_info: {},
      filing_frequency: [],
    };
    const rawAddress = mockData.address;
    const parts = rawAddress.split(',').map(p => p.trim());

    const addressArray = [
      {
        door_no: parts[0] || '',
        street: parts[1] || '',
        locality: parts[2] || '',
        district: parts[3] || '',
        state: parts[4] || '',
        pincode: parts[5] || ''
      }
    ];
       const responseData = {
      ...mockData,
      structured_address: addressArray
    };

    return res
      .status(200)
      .json(
        successResponse(200, "Transaction successful", null, true, responseData)
      );
    const { gstIn, transaction, location } = req.body;

    // Step 1: Encrypt each field
    const encryptedPayload = encryptDatanifi(
      JSON.stringify({
        p1: gstIn,
        p2: transaction,
        p3: location,
      })
    );

    if (!encryptedPayload?.encryptDatanifi) {
      return res.status(500).json({ message: "Failed to encrypt GST payload" });
    }

    const apiUrl =
      "https://api.nifipayments.com/api/v1/validate/corporate/gstin/lite";

    const response = await axios.post(
      apiUrl,
      { body: encryptedPayload.encryptDatanifi },
      {
        headers: {
          "x-client-id": "e26c92f1fb5a0b937a125b4797c8e42d",
          "x-api-key":
            "9efb1d0446137c4be81c06ddad6de420041000e0acd4baeaf03bfe624d7dbd0e",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const decryptedResponse = decryptDatanifi(
      response.data?.body || response.data
    );
    if (!decryptedResponse) {
      return res
        .status(500)
        .json({ message: "Failed to decrypt NIFI response" });
    }

    const encryptedFinal = encryptData(decryptedResponse);

    return res.status(200).json({ encrypted: encryptedFinal });
  } catch (error) {
    console.error(
      "GST validation failed:",
      error?.response?.data || error.message
    );
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "GST validation failed",
      error: error?.response?.data || error.message,
    });
  }
};

const validateIFSC = async (req, res) => {
  try {
     const staticIFSCData = {
      MICR: "202024014",
      BRANCH: "RAM GHAT ROAD ALIGARH",
      ADDRESS: "SHOP NO. 4 ADA MARKET SHOPPING COMPLEX",
      STATE: "UTTAR PRADESH",
      CONTACT: "",
      UPI: true,
      RTGS: true,
      CITY: "ALIGARH",
      CENTRE: "RAMGHAT ROAD DISTT ALIGARH",
      DISTRICT: "RAMGHAT ROAD DISTT ALIGARH",
      NEFT: true,
      IMPS: true,
      SWIFT: null,
      ISO3166: "IN-UP",
      BANK: "Punjab National Bank",
      BANKCODE: "PUNB",
      IFSC: "PUNB0656300",
    };

    return res.status(200).json(
      successResponse(
        200,
        "Transaction successful",
        null,
        true,
        staticIFSCData
      )
    );
  
    const { ifsc } = req.params;

    if (!ifsc) {
      return res.status(400).json({ message: "Missing IFSC code in query" });
    }

    const apiUrl = `https://ifsc.razorpay.com/${ifsc}`;

    const response = await axios.get(apiUrl);

    // return res.status(200).json({
    //   success: true,
    //   message: "IFSC code is valid",
    //   data: response.data,
    // });
    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Transaction successful",
          null,
          true,
          response.data
        )
      );
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json(
        errorResponse(
          error.response?.status || 500,
          "IFSC code validation failed",
          false,
          error.response?.data || error.message
        )
      );
  }
};

const validateAccountNumber = async (req, res) => {
  try {
     const mockNifiResponse = {
      statuscode: 10000,
      status: "success",
      message: "Successful | Account Details fetched successfully",
      uniqueId: "7a5687994a302bfe972d3fd4a395f9f0",
      apiTxnId: "NIFITEST180109X",
      data: {
        bank_ref_num: null,
        externalRef: "NIFI53832533",
        VerifiedName: "DHANANJAY PANDEY",
        account: 212201508185,
        ifsc: "ICIC0002122",
      },
      deduction: {
        amount: 0,
        charges: 5,
        tax: 0.9,
        adjustment: 5.9,
        balance: 242.28,
      },
      timestamp: "2025-05-19T19:07:14+05:30",
      environment: "production",
    };

    // Encrypting the static response before sending (if needed)
    const encryptedFinalacc = encryptData(JSON.stringify(mockNifiResponse));

    return res.status(200).json({ encrypted: encryptedFinalacc });
    const { accountnumber, ifsc, transactionId, latlong } = req.body;
    const encryptedPayloadacc = encryptDatanifi(
      JSON.stringify({
        p1: accountnumber,
        p2: ifsc,
        p3: transactionId,
        p11: latlong,
      })
    );
    if (!encryptedPayloadacc?.encryptDatanifi) {
      return res
        .status(500)
        .json({ message: "Failed to encrypt account payload" });
    }

    const apiUrl = "https://api.nifipayment.in/api/fi/validate-account/bank";

    const response = await axios.post(
      apiUrl,
      { body: encryptedPayloadacc.encryptDatanifi },
      {
        headers: {
          "x-client-id": "e26c92f1fb5a0b937a125b4797c8e42d",
          "x-api-key":"9efb1d0446137c4be81c06ddad6de420041000e0acd4baeaf03bfe624d7dbd0e",
        },
      }
    );

    const decryptedResponse = decryptDatanifi(
      response.data?.body || response.data
    );
    if (!decryptedResponse) {
      return res
        .status(500)
        .json({ message: "Failed to decrypt NIFI response" });
    }

    const encryptedFinal = encryptData(decryptedResponse);

    return res.status(200).json({ encrypted: encryptedFinal });
  } catch (error) {
    console.error(
      "Account validation failed:",
      error?.response?.data || error.message
    );
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "account validation failed",
      error: error?.response?.data || error.message,
    });
  }
};


const pancard = async (req, res) => {
  try {
    const mockpanResponse = {
      statuscode: 10000,
      status: "success",
      message: "Verified successfully",
      uniqueId: "3b7b896dfed6418db3a036ea514ba2ea",
      apiTxnId: "dfweytdfyetdf2132",
      data: {
        VerifiedPan: "XXXXX56L",
        VerifiedName: "Rajiv kumar",
        Dob: "01-01-1991"
      },
      deduction: {
        amount: 0.80,
        charges: 0,
        tax: 0,
        adjustment: 0,
        balance: 893.46
      },
      timestamp: "2024-05-19T17:10:27+05:30",
      environment: "production"
    };

    const encryptedFinalpan = encryptData(JSON.stringify(mockpanResponse));
    return res.status(200).json({ encrypted: encryptedFinalpan });

  } catch (error) {
    console.error(
      "pan validation failed:",
      error?.response?.data || error.message
    );
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "pan validation failed",
      error: error?.response?.data || error.message,
    });
  }
};
const upiId=async(req,res)=>{
try {
 const mockupi= {
  "statuscode": 10000,
  "status": "success",
  "message": "Verified successfully",
  "uniqueId": "3b7b896dfed6418db3a036ea514ba2ea",
  "apiTxnId": "dfweytdfyetdf2132",
  "data": {
    "bank_ref_num": "454545454545",
    "externalRef": "ARTER4567876543",
    "VerifiedName": "priya",
    "Vpa": "898989@ibl"
  },
  "deduction": {
    "amount": 0.80,
    "charges": 0,
    "tax": 0,
    "adjustment": 0,
    "balance": 893.46
  },
  "timestamp": "2024-05-19T17:10:27+05:30",
  "environment": "production"
}
   const encryptedFinalpupi = encryptData(JSON.stringify(mockupi));
    return res.status(200).json({ encrypted: encryptedFinalpupi });
} catch (error) {
   console.error(
      "upi validation failed:",
      error?.response?.data || error.message
    );
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "upi validation failed",
      error: error?.response?.data || error.message,
    });
  }
}


export { validateGST, validateIFSC, validateAccountNumber,pancard,upiId };
