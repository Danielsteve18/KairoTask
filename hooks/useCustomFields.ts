"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface CustomField {
  id: string;
  project_id: string;
  name: string;
  field_type: "text" | "number" | "date" | "select" | "boolean";
  options: string[];
  required: boolean;
  sort_order: number;
}

export interface CustomFieldValue {
  id: string;
  task_id: string;
  field_id: string;
  value: string | null;
}

export function useCustomFields(projectId: string) {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);

  const { data: fields = [], isLoading } = useQuery({
    queryKey: ["custom-fields", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_custom_fields")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true });

      if (error) throw new Error(error.message);
      return data as CustomField[];
    },
    enabled: !!projectId,
  });

  const createField = useMutation({
    mutationFn: async (input: {
      name: string;
      field_type: CustomField["field_type"];
      options?: string[];
      required?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("task_custom_fields")
        .insert([{ ...input, project_id: projectId, options: input.options ?? [] }])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") throw new Error("Ya existe un campo con ese nombre.");
        throw new Error(error.message);
      }
      return data as CustomField;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-fields", projectId] });
    },
  });

  const updateField = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CustomField> & { id: string }) => {
      const { data, error } = await supabase
        .from("task_custom_fields")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as CustomField;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-fields", projectId] });
    },
  });

  const deleteField = useMutation({
    mutationFn: async (fieldId: string) => {
      const { error } = await supabase
        .from("task_custom_fields")
        .delete()
        .eq("id", fieldId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-fields", projectId] });
    },
  });

  return { fields, isLoading, createField, updateField, deleteField };
}

export function useCustomFieldValues(taskId: string) {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);

  const { data: values = [], isLoading } = useQuery({
    queryKey: ["custom-field-values", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_custom_field_values")
        .select("*")
        .eq("task_id", taskId);

      if (error) throw new Error(error.message);
      return data as CustomFieldValue[];
    },
    enabled: !!taskId,
  });

  const setValue = useMutation({
    mutationFn: async ({ fieldId, value }: { fieldId: string; value: string | null }) => {
      const existing = values.find((v) => v.field_id === fieldId);

      if (existing) {
        if (value === null || value === "") {
          const { error } = await supabase
            .from("task_custom_field_values")
            .delete()
            .eq("id", existing.id);
          if (error) throw new Error(error.message);
        } else {
          const { error } = await supabase
            .from("task_custom_field_values")
            .update({ value })
            .eq("id", existing.id);
          if (error) throw new Error(error.message);
        }
      } else if (value !== null && value !== "") {
        const { error } = await supabase
          .from("task_custom_field_values")
          .insert([{ task_id: taskId, field_id: fieldId, value }]);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-field-values", taskId] });
    },
  });

  return { values, isLoading, setValue };
}
