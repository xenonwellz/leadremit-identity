export default {
    types: {
        'bvn-verification': {
            id: 'bvn-verification',
            name: 'BVN Verification',
            description: 'Verify Bank Verification Number (BVN)',
            cost: 2,
        },
        'nin-verification': {
            id: 'nin-verification',
            name: 'NIN Verification',
            description: 'Verify National Identity Number (NIN)',
            cost: 2,
        },
        'phone-verification': {
            id: 'phone-verification',
            name: 'Phone Number Verification',
            description: 'Verify Phone Number',
            cost: 1,
        },
    },
} as const
