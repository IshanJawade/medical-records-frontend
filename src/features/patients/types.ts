export type Patient = {
	id: number;
	mrn: string;
	name: string;
	dob: string | null; 
	sex: string | null;
	phone: string | null;
	addressLine1: string | null;
	addressLine2: string | null;
	city: string | null;
	state: string | null;
	zip: string | null;
	createdAt: string | null;
	updatedAt: string | null;
};
