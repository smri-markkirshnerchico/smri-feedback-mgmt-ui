import { Autocomplete, Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import { Field, schemaHelper } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { useFieldArray, Control, Controller } from "react-hook-form";
import { ISessionModule } from "src/types/session";

interface LOValuesTableProps {
  control: any;
  fields: any[];
  append: (data: any) => void;
  remove: (index: number) => void;
  sessionModules: ISessionModule[];
}

export function LOValuesTable({ control, fields, append, remove, sessionModules }: LOValuesTableProps) {
  return (
    <Box sx={{ boxShadow: 4, mb: 3 }}>
      <Table sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell>LOV Code</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell>Return Value</TableCell>
            <TableCell>Display Sequence</TableCell>
            <TableCell>Module(s)</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((item, index) => (
            <TableRow key={item.id} sx={{ height: 56 }}>
              <TableCell>
                <Controller
                  name={`Values[${index}].LOVCode`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      slotProps={{
                        input: { size: "small" }
                      }}
                    />
                  )}
                />
              </TableCell>

              <TableCell>
                <Controller
                  name={`Values[${index}].LOVDescription`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      slotProps={{
                        input: { size: "small" }
                      }}
                    />
                  )}
                />
              </TableCell>

              <TableCell>
                <Controller
                  name={`Values[${index}].Remarks`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      slotProps={{
                        input: { size: "small" }
                      }}
                    />
                  )}
                />
              </TableCell>

              <TableCell>
                <Controller
                  name={`Values[${index}].ReturnValue`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      slotProps={{
                        input: { size: "small" }
                      }}
                    />
                  )}
                />
              </TableCell>

              <TableCell>
                <Controller
                  name={`Values[${index}].DisplaySequence`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="number"
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      slotProps={{
                        input: { size: "small" }
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`Values[${index}].Modules`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      options={sessionModules}
                      value={field.value || []}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.ModuleName}
                      isOptionEqualToValue={(option, value) =>
                        option.ModuleId === value.ModuleId
                      }
                      onChange={(_, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Modules"
                        />
                      )}
                      sx={{
                        minWidth: 220,
                        maxWidth: 420,
                        "& .MuiAutocomplete-inputRoot": {
                          flexWrap: "nowrap",
                          overflowX: "auto"
                        }
                      }}
                    />
                  )}
                />
              </TableCell>

              <TableCell>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {fields.length > 1 && (
                    <Tooltip title="Remove" placement="top">
                      <IconButton onClick={() => remove(index)}>
                        <Iconify icon="pajamas:remove" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Add" placement="top">
                    <IconButton onClick={() => append({
                      LOVCode: "",
                      LOVDescription: "",
                      Remarks: "",
                      ReturnValue: "",
                      DisplaySequence: fields.length + 1,
                    })}>
                      <Iconify icon="ic:baseline-add" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
