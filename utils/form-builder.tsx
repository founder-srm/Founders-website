import { zodResolver } from '@hookform/resolvers/zod';
import React from "react";
import { useForm } from 'react-hook-form';
import { z, ZodSchema } from 'zod';

//types for table
//
interface FormFields {
	type: 'input' | 'textarea' | 'button';
	label: string;
	name: string;
	placeholder?: string;
	validation?: {
		required?: boolean;
		maxLength: number;
	};
}


//props 
//
//
//
interface FormBuilderProps {
	fields: FormFields[];
}


//form builder component 
//

const formbuilder: React.FC<FormBuilderProps> = ({ fields })

//validation schema
//
const schema: ZodSchema = z.object(
	fields.reduce((acc, field) => {
		if (field.validation) {
			acc[field.name] = field.validation.required
				? z.string().max(field.validation.maxLength || 100)
				: z.string().optional();
		}
		return acc;
	}, {} as Record<string, ZodSchema>)
);
const { register, handleSubmit } = useForm({
	Resolver: zodResolver(schema),
});
const onSubmit = (data: any) => {
	console.log(data);
};


return (
	<form onSubmit={handleSubmit(onSubmit)}>
		{fields.map((field, type) => {
			switch (field.type) {
				case 'input': return (<div key={index}>
					<label>{field.label}</label>
					<input {...register(field.name)} placeholder={field.placeholder} />
				</div>);

				case 'textarea':
					return (
						<div key={index}>
							<label>{field.label}</label>
							<textarea {...register(field.name)}
								placeholder={field.placeholder} />
						</div>
					);

				case 'button':
					return (
						<button type="submit" key={index}>
							{field.label}
						</button>


					);
				default:
					return null;



			}
		})}
	</form>


);



export default formbuilder;
