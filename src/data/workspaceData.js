export const activity = [
  { title: "Vehicle return policy", detail: "Asked about inspection, fuel, mileage, and contract closure.", time: "Now" },
  { title: "Roadside assistance SLA", detail: "Reviewed the urgent escalation workflow for immobilized customers.", time: "2 hours ago" },
  { title: "Winter tire coverage", detail: "Checked the fleet maintenance and seasonal equipment guidance.", time: "Yesterday" },
  { title: "Branch opening checklist", detail: "Looked up the daily readiness checklist for a rental branch.", time: "Yesterday" }
];

export const ragDocuments = {
  fleet: [
    ["Vehicle return and inspection playbook", "Confirm the agreement, record mileage and fuel, inspect the vehicle, photograph new damage, and close the contract after the checklist."],
    ["Branch opening checklist", "Verify keys, telematics, registration documents, clean-ready vehicles, safety equipment, and reservations before opening."],
    ["Vehicle maintenance escalation", "Warning lights, unsafe tires, failed brake inspections, and immobilized vehicles require fleet coordinator review."],
    ["Fuel and mileage exceptions", "Record exceptions with a contract note, supporting photo, and manager approval without overwriting original values."],
    ["Clean-ready vehicle standard", "A vehicle is clean-ready when the cabin is vacuumed, glass and mirrors are clear, warning labels are visible, and no personal property remains inside."],
    ["Inter-branch vehicle transfer", "Confirm receiving branch, mileage, fuel, damage status, key count, and open maintenance tickets before a vehicle transfer."]
  ],
  care: [
    ["Roadside assistance triage", "Collect contract number, callback number, location, safety conditions, and symptoms. Mark danger or injury cases urgent."],
    ["Regional escalation matrix", "Route unresolved roadside cases to the regional assistance queue and escalate cases beyond the response target."],
    ["Service recovery guidance", "Acknowledge the experience, summarize the next action, set a callback expectation, and update the support timeline."],
    ["Customer data handling", "Use contract and case identifiers in notes. Avoid unnecessary payment details or unrelated personal information."],
    ["Callback commitment standard", "Record the target time, responsible queue, preferred contact channel, and requested customer outcome for each promised callback."],
    ["Replacement vehicle request", "Confirm immobility, passenger safety, location, contract status, and destination branch before requesting a replacement vehicle."]
  ]
};
