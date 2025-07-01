import mongoose from "mongoose";

export const footerSchema = new mongoose.Schema({
  footerLogo: {
    type: String,
    default: null
  },

  footerText: {
    type: String,
    default: null
  },

  footerSections: [
    {
      heading: {
        type: String,default: null
        // required: false
      },
      footerLinks: [
        {
          label: {
            type: String,default: null
            // required: true
          },
          url: {
            type: String,default: null
            // required: true
          },
          labelColor: {
            type: String,
            default: "blue"
          }
        }
      ]
    }
  ],

  copyrightText: {
    type: String,default: null
    // required: true
  },

  FootersocialMedia: [
    {
      image: {
        type: String,default: null
        // required: true
      },
      url: {
        type: String,default: null
        // required: true
      }
    }
  ],

  Address: {
    street: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    pinCode: {
      type: String,
      default: null
    },
    textsize: {
      type: String,
      default: null
    },
    textFontFamily: {
      type: String,
      default: null
    }
  },

  footerEmail: [
    {
      foemail: {
        type: String,
        default: null
      }
    }
  ],

  footerMobile: [
    {
      footermobile: {
        type: String,
        default: null
      }
    }
  ]
});


