export const categoryMapping = {
    "AC": {
        subTypes: ["Split AC", "Window AC"],
        actions: [
            { label: "Super saver packages", value: "Super saver packages" },
            { label: "Service", value: "Service" },
            { label: "Repair & gas refill", value: "Repair & gas refill" },
            { label: "Installation/uninstallation", value: "Installation/uninstallation" }
        ]
    },
    "Salon": {
        subTypes: ["Salon for Women", "Salon for Men"],
        actions: {
            "Salon for Women": [
                { label: "Hair Cut", value: "Hair Cut" },
                { label: "Facial & Cleanup", value: "Facial & Cleanup" },
                { label: "Manicure & Pedicure", value: "Manicure" },
                { label: "Waxing", value: "Waxing" },
                { label: "Massage", value: "Massage" },
                { label: "Super saver packages", value: "Super saver packages" }
            ],
            "Salon for Men": [
                { label: "Hair Cut", value: "Hair Cut" },
                { label: "Facial & Cleanup", value: "Facial & Cleanup" },
                { label: "Massage", value: "Massage" },
                { label: "Beard Grooming", value: "Beard" },
                { label: "Super saver packages", value: "Super saver packages" }
            ]
        }
    },
    "Electrician": {
        subTypes: ["InstaHelp", "Standard"],
        actions: {
            "InstaHelp": [
                { label: "Switch Shock (Urgent)", value: "Switch Shock" }
            ],
            "Standard": [
                { label: "Fan Repair", value: "Fan" },
                { label: "Light Installation", value: "Light" },
                { label: "Switch & Socket", value: "Switch & Socket" },
                { label: "MCB & Fuse", value: "MCB & Fuse" },
                { label: "Wiring", value: "Wiring" }
            ]
        }
    },
    "Plumbing": {
        subTypes: ["InstaHelp", "Standard"],
        actions: {
            "InstaHelp": [
                { label: "Tap Leakage (Urgent)", value: "Tap Leakage" },
                { label: "Blocked Basin (Urgent)", value: "Blocked Basin" }
            ],
            "Standard": [
                { label: "Tap & Mixer", value: "Tap & Mixer" },
                { label: "Basin & Sink", value: "Basin & Sink" },
                { label: "Toilet Repair", value: "Toilet" },
                { label: "Water Tank", value: "Water Tank" },
                { label: "Blockage", value: "Blockage" }
            ]
        }
    },
    "Appliances": {
        subTypes: ["AC", "Washing Machine", "Refrigerator", "Microwave", "Television", "Chimney", "Laptop"],
        actions: [
            { label: "Repair", value: "Repair" },
            { label: "Service", value: "Service" },
            { label: "Installation", value: "Installation" }
        ]
    },
    "Cleaning": {
        subTypes: ["Deep Cleaning", "Pest Control"],
        actions: {
            "Deep Cleaning": [
                { label: "Full Home Cleaning", value: "Full Home Cleaning" },
                { label: "Bathroom & Kitchen Cleaning", value: "Bathroom & Kitchen Cleaning" },
                { label: "Sofa & Carpet Cleaning", value: "Sofa & Carpet Cleaning" },
                { label: "Full Home Clean", value: "Full Home Clean" }
            ],
            "Pest Control": [
                { label: "Cockroach & Ant Control", value: "Cockroach & Ant Control" },
                { label: "Termites & Bed Bug Control", value: "Termites & Bed Bug Control" }
            ]
        }
    },
    "Carpenter": {
        subTypes: [],
        actions: [
            { label: "Drill & Hang", value: "Drill & Hang" },
            { label: "Furniture Repair", value: "Furniture Repair" },
            { label: "Door & Window", value: "Door & Window" },
            { label: "Furniture Assembly", value: "Furniture Assembly" }
        ]
    },
    "RO": {
        subTypes: [],
        actions: [
            { label: "RO Service", value: "RO Service" },
            { label: "RO Repair", value: "RO Repair" },
            { label: "RO Installation", value: "RO Installation" }
        ]
    },
    "Painting": {
        subTypes: [],
        actions: [
            { label: "Fresh Painting", value: "Fresh Painting" },
            { label: "Rental Painting", value: "Rental Painting" },
            { label: "Waterproofing", value: "Waterproofing" },
            { label: "Wall Decor", value: "Wall Decor" }
        ]
    },
    "Smart Lock": {
        subTypes: [],
        actions: [
            { label: "Installation", value: "Smart Lock Installation" },
            { label: "Repair & Config", value: "Smart Lock Repair" },
            { label: "Demo", value: "Smart Lock Demo" }
        ]
    },
    "Home Maids": {
        subTypes: [],
        actions: [
            { label: "Maid for Cooking", value: "Maid for Cooking" },
            { label: "Daily Cleaning Maid", value: "Daily Cleaning Maid" },
            { label: "Full Time Maid", value: "Full Time Maid" },
            { label: "Babysitter", value: "Babysitter" },
            { label: "Elderly Care", value: "Elderly Care" }
        ]
    }
};

export const unitMapping = {
    "AC": "AC",
    "RO": "RO",
    "Appliances": "Appliance",
    "Electrician": "Point",
    "Plumbing": "Point",
    "Carpenter": "Unit",
    "Cleaning": "Service",
    "Painting": "Sq.ft",
    "Salon": "Service",
    "Smart Lock": "Lock",
    "Home Maids": "Maid"
};
