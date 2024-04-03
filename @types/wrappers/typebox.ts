import * as TypeBox from "@sinclair/typebox";

function Nullish<T extends TypeBox.TSchema>(
	property: T,
	options?: TypeBox.ObjectOptions,
): TypeBox.TOptional<TypeBox.TUnion<[T, TypeBox.TNull]>> {
	return TypeBox.Optional(
		TypeBox.Union([property, TypeBox.Null()], { ...options }),
	);
}
function Nullable<T extends TypeBox.TSchema>(
	property: T,
	options?: TypeBox.ObjectOptions,
): TypeBox.TUnion<[T, TypeBox.TNull]> {
	return TypeBox.Union([property, TypeBox.Null()], { ...options });
}

interface TWithNullableAndNullish extends Omit<typeof TypeBox, ""> {
	Nullable: typeof Nullable;
	Nullish: typeof Nullish;
}

export const t: TWithNullableAndNullish = {
	...TypeBox,
	Nullable,
	Nullish,
};
