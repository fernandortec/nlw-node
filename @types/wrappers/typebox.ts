import * as TypeBox from "@sinclair/typebox";

function Nullable<T extends TypeBox.TSchema>(
	property: T,
	options?: TypeBox.ObjectOptions,
): TypeBox.TOptional<TypeBox.TUnion<[T, TypeBox.TNull]>> {
	return TypeBox.Optional(
		TypeBox.Union([property, TypeBox.Null()], { ...options }),
	);
}
interface TWithNullable extends Omit<typeof TypeBox, ""> {
	Nullable: typeof Nullable;
}

export const t: TWithNullable = {
	...TypeBox,
	Nullable,
};
