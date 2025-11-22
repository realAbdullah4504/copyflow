begin
  delete from notifications
WHERE created_at < now() - interval '1 day';
end;